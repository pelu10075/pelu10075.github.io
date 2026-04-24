/**
 * 문제 풀이 데이터 로드 및 검색
 *
 * 1순위: /problems-data.json  (빌드 시 생성)
 * 2순위: 라이브 API 직접 fetch (dev 환경)
 */

// ── 상수 ─────────────────────────────────────────────────────────────────────

const CF_HANDLE = 'edward_10';
const LC_HANDLE = 'edward_10';
const GH_OWNER  = 'pelu10075';
const GH_REPO   = 'codeforces';
const GH_BRANCH = 'main';

const CF_STATUS_API  = `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`;
const GH_TREE_API    = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/trees/${GH_BRANCH}?recursive=1`;
const LC_GQL         = 'https://leetcode.com/graphql/';

export const LC_REPO_URL  = `https://github.com/${GH_OWNER}/leetcode`;
export const LC_BLOB_BASE = `https://github.com/${GH_OWNER}/leetcode/blob/${GH_BRANCH}`;

export const TREE_BASE = `https://github.com/${GH_OWNER}/${GH_REPO}/tree/${GH_BRANCH}`;
export const REPO_URL  = `https://github.com/${GH_OWNER}/${GH_REPO}`;

// ── 타입 ─────────────────────────────────────────────────────────────────────

export type ProblemEntry = {
	type: 'problem';
	id: string;
	contestId: number;
	title: string;
	difficulty: number;
	tags: string[];
	solved: boolean;
	folderPath: string | null;
};

export type LCProblemEntry = {
	type: 'lc_problem';
	id: string;                              // questionFrontendId e.g. "1"
	titleSlug: string;
	title: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	tags: string[];
	filePath: string;                        // e.g. "1.py" — in pelu10075/leetcode repo (may 404 if not yet added)
};

// ── 캐시 ─────────────────────────────────────────────────────────────────────

let _cfCache: ProblemEntry[] | null = null;
let _lcCache: LCProblemEntry[] | null = null;

// ── 정적 JSON 로드 (1순위) ────────────────────────────────────────────────────

async function tryStaticJSON(): Promise<{ cf: ProblemEntry[]; lc: LCProblemEntry[] } | null> {
	try {
		const res = await fetch('/problems-data.json');
		if (!res.ok) return null;
		const data = (await res.json()) as {
			cf?: ProblemEntry[];
			lc?: LCProblemEntry[];
		};
		if ((data.cf?.length ?? 0) > 0 || (data.lc?.length ?? 0) > 0) return { cf: data.cf ?? [], lc: data.lc ?? [] };
	} catch { /* fall through */ }
	return null;
}

// ── Codeforces 라이브 로드 ────────────────────────────────────────────────────

export async function loadCF(): Promise<ProblemEntry[]> {
	if (_cfCache) return _cfCache;

	const json = await tryStaticJSON();
	if (json) {
		_cfCache = json.cf;
		_lcCache = json.lc; // LC도 함께 캐싱
		return _cfCache;
	}

	// 라이브 fallback
	type CFSub = {
		verdict?: string;
		problem: { contestId: number; index: string; name: string; rating?: number; tags: string[] };
	};
	const res = await fetch(CF_STATUS_API);
	if (!res.ok) throw new Error(`CF API ${res.status}`);
	const { status, result } = (await res.json()) as { status: string; result: CFSub[] };
	if (status !== 'OK') throw new Error(`CF API: ${status}`);

	const map = new Map<string, { contestId: number; title: string; difficulty: number; tags: string[]; solved: boolean }>();
	for (const sub of result) {
		const { contestId, index, name, rating, tags } = sub.problem;
		const id = `${contestId}${index}`;
		const ok = sub.verdict === 'OK';
		if (!map.has(id)) map.set(id, { contestId, title: name, difficulty: rating ?? 0, tags, solved: ok });
		else if (ok) map.get(id)!.solved = true;
	}

	const folderSet = new Set<string>();
	try {
		const t = await fetch(GH_TREE_API, {
			headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
		});
		if (t.ok) {
			const { tree } = (await t.json()) as { tree: { path: string }[] };
			for (const n of tree) {
				const m = n.path.match(/^problems\/([^/]+)\//);
				if (m) folderSet.add(m[1]);
			}
		}
	} catch { /* ignore */ }

	_cfCache = Array.from(map.entries())
		.map(([id, d]) => ({
			type: 'problem' as const,
			id, contestId: d.contestId, title: d.title, difficulty: d.difficulty, tags: d.tags,
			solved: d.solved, folderPath: folderSet.has(id) ? `problems/${id}` : null,
		}))
		.sort((a, b) => a.id.localeCompare(b.id));
	return _cfCache;
}

// ── LeetCode 라이브 로드 ──────────────────────────────────────────────────────

export async function loadLC(): Promise<LCProblemEntry[]> {
	if (_lcCache) return _lcCache;

	const json = await tryStaticJSON();
	if (json) {
		_cfCache = json.cf;
		_lcCache = json.lc;
		return _lcCache;
	}

	// 라이브 fallback
	const gqlFetch = async (query: string, variables?: Record<string, unknown>) => {
		const r = await fetch(LC_GQL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
			body: JSON.stringify({ query, variables }),
		});
		if (!r.ok) throw new Error(`LC GraphQL ${r.status}`);
		return r.json() as Promise<{ data?: Record<string, unknown> }>;
	};

	const acRes = await gqlFetch(
		`query($u:String!,$l:Int!){recentAcSubmissionList(username:$u,limit:$l){titleSlug title}}`,
		{ u: LC_HANDLE, l: 1000 },
	);
	const raw = (acRes.data?.recentAcSubmissionList ?? []) as { titleSlug: string }[];
	const slugs = [...new Set(raw.map((s) => s.titleSlug))];

	const problems: LCProblemEntry[] = [];
	const BATCH = 25;
	for (let i = 0; i < slugs.length; i += BATCH) {
		const chunk = slugs.slice(i, i + BATCH);
		const aliases = chunk
			.map((slug, j) => `q${j}:question(titleSlug:"${slug}"){questionFrontendId title difficulty topicTags{name}}`)
			.join(' ');
		try {
			const r = await gqlFetch(`query{${aliases}}`);
			for (let j = 0; j < chunk.length; j++) {
				const q = r.data?.[`q${j}`] as {
					questionFrontendId: string; title: string; difficulty: string; topicTags: { name: string }[];
				} | null;
				if (!q) continue;
				const qid = q.questionFrontendId;
				problems.push({
					type: 'lc_problem', id: qid, titleSlug: chunk[j],
					title: q.title, difficulty: q.difficulty as LCProblemEntry['difficulty'],
					tags: q.topicTags.map((t) => t.name),
					filePath: `${qid}.py`,  // 파일명 규칙: {id}.py
				});
			}
		} catch { /* skip batch */ }
	}

	_lcCache = problems.sort((a, b) => Number(a.id) - Number(b.id));
	return _lcCache;
}

// ── 검색 ─────────────────────────────────────────────────────────────────────

export function searchCF(query: string, entries: ProblemEntry[]): ProblemEntry[] {
	const q  = query.trim();
	const ql = q.toLowerCase();
	if (!q) return entries;
	if (/^\d+$/.test(q))          return entries.filter((p) => p.id.toLowerCase().startsWith(ql));
	if (/^\d+[A-Za-z][1-9]?$/.test(q)) return entries.filter((p) => p.id.toLowerCase().startsWith(ql));
	if (/^[A-Za-z][1-9]?$/.test(q)) {
		const letter = q.toUpperCase();
		return entries.filter((p) => p.id.replace(/^\d+/, '') === letter);
	}
	return entries.filter(
		(p) => p.title.toLowerCase().includes(ql) || p.tags.some((t) => t.toLowerCase().includes(ql)),
	);
}

export function searchLC(query: string, entries: LCProblemEntry[]): LCProblemEntry[] {
	const q  = query.trim();
	const ql = q.toLowerCase();
	if (!q) return entries;
	if (/^\d+$/.test(q)) return entries.filter((p) => p.id.startsWith(q));
	if (ql === 'easy' || ql === 'medium' || ql === 'hard')
		return entries.filter((p) => p.difficulty.toLowerCase() === ql);
	return entries.filter(
		(p) => p.title.toLowerCase().includes(ql) || p.tags.some((t) => t.toLowerCase().includes(ql)),
	);
}

// ── 색상 헬퍼 ─────────────────────────────────────────────────────────────────

export function cfDiffColor(d: number): string {
	if (!d || d < 1) return '#808080';
	if (d < 1200)    return '#808080';
	if (d < 1400)    return '#008000';
	if (d < 1600)    return '#03a89e';
	if (d < 1900)    return '#0000ff';
	if (d < 2100)    return '#aa00aa';
	if (d < 2400)    return '#ff8c00';
	return '#ff0000';
}

export function lcDiffColor(d: LCProblemEntry['difficulty']): string {
	if (d === 'Easy')   return '#00b8a3';
	if (d === 'Medium') return '#ffc01e';
	return '#ff375f'; // Hard
}

/** @deprecated use cfDiffColor */
export const difficultyColor = cfDiffColor;
