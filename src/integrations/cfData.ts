/**
 * Astro integration — 빌드 시 Codeforces API + GitHub tree를 결합해
 * public/cf-data.json을 생성한다.
 *
 * 데이터 소스:
 *   1. https://codeforces.com/api/user.status  → 제출 이력(난이도·태그·solved 여부)
 *   2. GitHub Trees API                        → 로컬 폴더 매핑
 */

import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const CF_HANDLE = 'pelu10075';
const GH_OWNER  = 'pelu10075';
const GH_REPO   = 'codeforces';
const GH_BRANCH = 'main';

const CF_STATUS_API = `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`;
const TREE_API      = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/trees/${GH_BRANCH}?recursive=1`;

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

export function cfDataIntegration(): AstroIntegration {
	return {
		name: 'cf-data',
		hooks: {
			'astro:build:start': async ({ logger }) => {
				logger.info('[cf-data] Building problem data…');
				try {
					// ── 1. CF API: 제출 이력 ──────────────────────────────
					const cfRes = await fetch(CF_STATUS_API);
					if (!cfRes.ok) throw new Error(`CF API ${cfRes.status}`);
					const cfJson = (await cfRes.json()) as { status: string; result: CFSubmission[] };
					if (cfJson.status !== 'OK') throw new Error(`CF API: ${cfJson.status}`);

					// ── 2. 문제 별 중복 제거 + solved 추적 ────────────────
					const problemMap = new Map<
						string,
						{
							contestId: number;
							index: string;
							title: string;
							difficulty: number;
							tags: string[];
							solved: boolean;
						}
					>();

					for (const sub of cfJson.result) {
						const { contestId, index, name, rating, tags } = sub.problem;
						const id = `${contestId}${index}`;
						const isSolved = sub.verdict === 'OK';

						if (!problemMap.has(id)) {
							problemMap.set(id, {
								contestId,
								index,
								title: name,
								difficulty: rating ?? 0,
								tags,
								solved: isSolved,
							});
						} else if (isSolved) {
							// 한 번이라도 AC면 solved
							problemMap.get(id)!.solved = true;
						}
					}

					// ── 3. GitHub tree: 로컬 폴더 유무 확인 ──────────────
					const treeRes = await fetch(TREE_API, {
						headers: {
							Accept: 'application/vnd.github+json',
							'X-GitHub-Api-Version': '2022-11-28',
						},
					});
					const folderSet = new Set<string>();
					if (treeRes.ok) {
						const { tree } = (await treeRes.json()) as {
							tree: { path: string; type: string }[];
						};
						for (const node of tree) {
							const m = node.path.match(/^problems\/([^/]+)\//);
							if (m) folderSet.add(m[1]);
						}
					} else {
						logger.warn(`[cf-data] GitHub tree API ${treeRes.status} — folder links disabled`);
					}

					// ── 4. ProblemEntry 배열 생성 ─────────────────────────
					const problems = Array.from(problemMap.entries())
						.map(([id, data]) => ({
							type: 'problem' as const,
							id,
							contestId: data.contestId,
							title: data.title,
							difficulty: data.difficulty,
							tags: data.tags,
							solved: data.solved,
							folderPath: folderSet.has(id) ? `problems/${id}` : null,
						}))
						.sort((a, b) => a.id.localeCompare(b.id));

					// ── 5. JSON 저장 ──────────────────────────────────────
					const json = JSON.stringify(
						{ generatedAt: new Date().toISOString(), problems },
						null,
						2,
					);
					await writeFile(resolve('public/cf-data.json'), json, 'utf-8');
					logger.info(
						`[cf-data] Done — ${problems.length} problems (${problems.filter((p) => p.solved).length} solved)`,
					);
				} catch (err) {
					logger.warn(`[cf-data] Failed: ${err}. Runtime will fall back to live API.`);
				}
			},
		},
	};
}
