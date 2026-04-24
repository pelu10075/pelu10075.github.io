/**
 * Astro integration — 빌드 시 두 가지 데이터 소스를 결합해 public/problems-data.json 생성
 *
 *   Codeforces: user.status API → 제출 이력(solved 여부, 난이도, 태그)
 *   LeetCode  : GraphQL recentAcSubmissionList → AC 목록
 *               + 배치 alias 쿼리로 난이도·태그 조회
 *   GitHub    : tree API → 로컬 폴더 매핑 (CF 전용)
 */

import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// ── 설정 ─────────────────────────────────────────────────────────────────────

const CF_HANDLE  = 'edward_10';
const LC_HANDLE  = 'edward_10';
const GH_OWNER   = 'pelu10075';
const GH_REPO    = 'codeforces';
const LC_REPO    = 'leetcode';
const GH_BRANCH  = 'main';

const CF_STATUS_API  = `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`;
const LC_GQL         = 'https://leetcode.com/graphql/';
const CF_TREE_API    = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/trees/${GH_BRANCH}?recursive=1`;

const LC_HEADERS = {
	'Content-Type': 'application/json',
	'User-Agent':   'Mozilla/5.0 (compatible; portfolio-builder/1.0)',
	'Referer':      'https://leetcode.com',
};

// ── 타입 ─────────────────────────────────────────────────────────────────────

type CFSubmission = {
	verdict?: string;
	problem: {
		contestId: number;
		index: string;
		name: string;
		rating?: number;
		tags: string[];
	};
};

type LCProblem = {
	type: 'lc_problem';
	id: string;               // questionFrontendId e.g. "1"
	titleSlug: string;
	title: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	tags: string[];
	filePath: string;         // e.g. "1.py" (존재 여부는 런타임에서 판단)
};

// ── LeetCode 헬퍼 ─────────────────────────────────────────────────────────────

async function lcQuery(query: string, variables?: Record<string, unknown>) {
	const res = await fetch(LC_GQL, {
		method: 'POST',
		headers: LC_HEADERS,
		body: JSON.stringify({ query, variables }),
	});
	if (!res.ok) throw new Error(`LC GraphQL HTTP ${res.status}`);
	return res.json() as Promise<{ data?: Record<string, unknown>; errors?: unknown[] }>;
}

async function fetchLCProblems(logger: { info(m: string): void; warn(m: string): void }) {
	// ── 1. AC 제출 목록 취득 ────────────────────────────────────────
	logger.info('[cf-data] Fetching LeetCode AC submissions…');
	const acRes = await lcQuery(
		`query($u:String!,$l:Int!){recentAcSubmissionList(username:$u,limit:$l){titleSlug title}}`,
		{ u: LC_HANDLE, l: 1000 },
	);

	if (acRes.errors?.length) throw new Error(`LC recentAcSubmissions: ${JSON.stringify(acRes.errors[0])}`);

	const raw = (acRes.data?.recentAcSubmissionList ?? []) as { titleSlug: string; title: string }[];
	// 중복 제거 (같은 문제를 여러 번 AC)
	const solvedMap = new Map<string, string>(); // slug → title
	for (const s of raw) {
		if (!solvedMap.has(s.titleSlug)) solvedMap.set(s.titleSlug, s.title);
	}
	const slugs = Array.from(solvedMap.keys());
	logger.info(`[cf-data] LC: ${slugs.length} unique solved problems`);
	if (slugs.length === 0) return [];

	// ── 2. 배치 alias 쿼리로 난이도·태그 조회 (25개씩) ────────────
	const BATCH = 25;
	const problems: LCProblem[] = [];

	for (let i = 0; i < slugs.length; i += BATCH) {
		const chunk = slugs.slice(i, i + BATCH);
		const aliases = chunk
			.map(
				(slug, j) =>
					`q${j}:question(titleSlug:"${slug}"){questionFrontendId title difficulty topicTags{name}}`,
			)
			.join(' ');

		try {
			const res = await lcQuery(`query{${aliases}}`);
			for (let j = 0; j < chunk.length; j++) {
				const q = res.data?.[`q${j}`] as {
					questionFrontendId: string;
					title: string;
					difficulty: string;
					topicTags: { name: string }[];
				} | null;
				if (!q) continue;
				const qid = q.questionFrontendId;
				problems.push({
					type:       'lc_problem',
					id:         qid,
					titleSlug:  chunk[j],
					title:      q.title,
					difficulty: (q.difficulty as LCProblem['difficulty']) ?? 'Medium',
					tags:       q.topicTags.map((t) => t.name),
					filePath:   `${qid}.py`,  // 파일명 규칙: {id}.py (존재 여부는 모달에서 판단)
				});
			}
		} catch (err) {
			logger.warn(`[cf-data] LC batch ${i}–${i + BATCH} failed: ${err}`);
		}
	}

	// id 숫자 오름차순
	problems.sort((a, b) => Number(a.id) - Number(b.id));
	return problems;
}

// ── Integration ───────────────────────────────────────────────────────────────

export function cfDataIntegration(): AstroIntegration {
	return {
		name: 'cf-data',
		hooks: {
			'astro:build:start': async ({ logger }) => {
				logger.info('[cf-data] Building problem data…');

				// ── Codeforces ──────────────────────────────────────────────
				let cfProblems: unknown[] = [];
				try {
					const cfRes = await fetch(CF_STATUS_API);
					if (!cfRes.ok) throw new Error(`CF API ${cfRes.status}`);
					const cfJson = (await cfRes.json()) as { status: string; result: CFSubmission[] };
					if (cfJson.status !== 'OK') throw new Error(`CF API: ${cfJson.status}`);

					const problemMap = new Map<
						string,
						{
							contestId: number;
							title: string;
							difficulty: number;
							tags: string[];
							solved: boolean;
						}
					>();
					for (const sub of cfJson.result) {
						const { contestId, index, name, rating, tags } = sub.problem;
						const id = `${contestId}${index}`;
						const ok = sub.verdict === 'OK';
						if (!problemMap.has(id)) {
							problemMap.set(id, { contestId, title: name, difficulty: rating ?? 0, tags, solved: ok });
						} else if (ok) {
							problemMap.get(id)!.solved = true;
						}
					}

					// GitHub tree: folder set
					const folderSet = new Set<string>();
					try {
						const tRes = await fetch(CF_TREE_API, {
							headers: {
								Accept: 'application/vnd.github+json',
								'X-GitHub-Api-Version': '2022-11-28',
							},
						});
						if (tRes.ok) {
							const { tree } = (await tRes.json()) as { tree: { path: string }[] };
							for (const n of tree) {
								const m = n.path.match(/^problems\/([^/]+)\//);
								if (m) folderSet.add(m[1]);
							}
						}
					} catch { /* folder links disabled */ }

					cfProblems = Array.from(problemMap.entries())
						.map(([id, d]) => ({
							type:       'problem',
							id,
							contestId:  d.contestId,
							title:      d.title,
							difficulty: d.difficulty,
							tags:       d.tags,
							solved:     d.solved,
							folderPath: folderSet.has(id) ? `problems/${id}` : null,
						}))
						.sort((a, b) => (a as { id: string }).id.localeCompare((b as { id: string }).id));

					logger.info(
						`[cf-data] CF: ${cfProblems.length} problems (${cfProblems.filter((p) => (p as { solved: boolean }).solved).length} solved)`,
					);
				} catch (err) {
					logger.warn(`[cf-data] CF fetch failed: ${err}`);
				}

				// ── LeetCode ────────────────────────────────────────────────
				let lcProblems: unknown[] = [];
				try {
					lcProblems = await fetchLCProblems(logger);
					logger.info(`[cf-data] LC: ${lcProblems.length} problems written`);
				} catch (err) {
					logger.warn(`[cf-data] LC fetch failed: ${err}`);
				}

				// ── 파일 저장 ────────────────────────────────────────────────
				const json = JSON.stringify(
					{ generatedAt: new Date().toISOString(), cf: cfProblems, lc: lcProblems },
					null,
					2,
				);
				await writeFile(resolve('public/problems-data.json'), json, 'utf-8');
				logger.info('[cf-data] problems-data.json written');
			},
		},
	};
}
