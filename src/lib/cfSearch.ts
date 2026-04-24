/**
 * Codeforces 문제 풀이 — 런타임 데이터 로드 및 검색
 *
 * 로딩 전략:
 *   1순위: /cf-data.json  (빌드 시 cfDataIntegration이 생성, 1 fetch)
 *   2순위: CF user.status API + GitHub tree (dev / 정적 파일 없을 때)
 */

const CF_HANDLE = 'pelu10075';
const OWNER     = 'pelu10075';
const REPO      = 'codeforces';
const BRANCH    = 'main';

const CF_STATUS_API = `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`;
const TREE_API      = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;

export const TREE_BASE = `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`;
export const REPO_URL  = `https://github.com/${OWNER}/${REPO}`;

// ── 타입 ─────────────────────────────────────────────────────────────────────

export type ProblemEntry = {
	type: 'problem';
	id: string;          // e.g. "2220A"
	contestId: number;   // e.g. 2220
	title: string;
	difficulty: number;  // CF rating, 0 = unrated
	tags: string[];
	solved: boolean;     // CF verdict === 'OK' 존재 여부
	folderPath: string | null; // "problems/2220A" or null
};

// ── 캐시 ─────────────────────────────────────────────────────────────────────

let _cache: ProblemEntry[] | null = null;

// ── loadEntries ───────────────────────────────────────────────────────────────

export async function loadEntries(): Promise<ProblemEntry[]> {
	if (_cache) return _cache;

	// 1순위: 정적 JSON
	try {
		const res = await fetch('/cf-data.json');
		if (res.ok) {
			const { problems } = (await res.json()) as { problems: ProblemEntry[] };
			if (Array.isArray(problems) && problems.length > 0) {
				_cache = problems;
				return problems;
			}
		}
	} catch {
		// fall through to live API
	}

	// 2순위: 라이브 API (dev 환경)
	type CFSub = {
		verdict?: string;
		problem: { contestId: number; index: string; name: string; rating?: number; tags: string[] };
	};
	const cfRes = await fetch(CF_STATUS_API);
	if (!cfRes.ok) throw new Error(`CF API ${cfRes.status}`);
	const { status, result } = (await cfRes.json()) as { status: string; result: CFSub[] };
	if (status !== 'OK') throw new Error(`CF API: ${status}`);

	const problemMap = new Map<
		string,
		{ contestId: number; title: string; difficulty: number; tags: string[]; solved: boolean }
	>();
	for (const sub of result) {
		const { contestId, index, name, rating, tags } = sub.problem;
		const id = `${contestId}${index}`;
		const ok = sub.verdict === 'OK';
		if (!problemMap.has(id)) {
			problemMap.set(id, { contestId, title: name, difficulty: rating ?? 0, tags, solved: ok });
		} else if (ok) {
			problemMap.get(id)!.solved = true;
		}
	}

	// GitHub tree — folder set
	const folderSet = new Set<string>();
	try {
		const tRes = await fetch(TREE_API, {
			headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
		});
		if (tRes.ok) {
			const { tree } = (await tRes.json()) as { tree: { path: string }[] };
			for (const n of tree) {
				const m = n.path.match(/^problems\/([^/]+)\//);
				if (m) folderSet.add(m[1]);
			}
		}
	} catch { /* folder links disabled */ }

	const problems: ProblemEntry[] = Array.from(problemMap.entries())
		.map(([id, d]) => ({
			type: 'problem' as const,
			id,
			contestId: d.contestId,
			title: d.title,
			difficulty: d.difficulty,
			tags: d.tags,
			solved: d.solved,
			folderPath: folderSet.has(id) ? `problems/${id}` : null,
		}))
		.sort((a, b) => a.id.localeCompare(b.id));

	_cache = problems;
	return problems;
}

// ── performSearch ─────────────────────────────────────────────────────────────

export function performSearch(query: string, entries: ProblemEntry[]): ProblemEntry[] {
	const q  = query.trim();
	const ql = q.toLowerCase();
	if (!q) return entries;

	// 순수 숫자 — contestId prefix (e.g. "2220" → 2220A, 2220B…)
	if (/^\d+$/.test(q)) {
		return entries.filter((p) => p.id.toLowerCase().startsWith(ql));
	}
	// 문제 ID (e.g. "2220A", "2220B1")
	if (/^\d+[A-Za-z][1-9]?$/.test(q)) {
		return entries.filter((p) => p.id.toLowerCase().startsWith(ql));
	}
	// 단일 알파벳 (e.g. "A", "B1")
	if (/^[A-Za-z][1-9]?$/.test(q)) {
		const letter = q.toUpperCase();
		return entries.filter((p) => p.id.replace(/^\d+/, '') === letter);
	}
	// 텍스트 — 제목 · 태그 부분 일치
	return entries.filter(
		(p) =>
			p.title.toLowerCase().includes(ql) ||
			p.tags.some((t) => t.toLowerCase().includes(ql)),
	);
}

// ── difficultyColor ───────────────────────────────────────────────────────────

export function difficultyColor(d: number): string {
	if (!d || d < 1) return '#808080';
	if (d < 1200)    return '#808080';
	if (d < 1400)    return '#008000';
	if (d < 1600)    return '#03a89e';
	if (d < 1900)    return '#0000ff';
	if (d < 2100)    return '#aa00aa';
	if (d < 2400)    return '#ff8c00';
	return '#ff0000';
}
