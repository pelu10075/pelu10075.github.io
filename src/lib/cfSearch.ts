/**
 * Codeforces 문제 풀이 저장소 — 런타임 데이터 페치 및 스마트 검색
 *
 * 데이터 로딩 전략 (N+1 → 1):
 *   1순위: /cf-data.json  (빌드 시 cfDataIntegration이 생성한 정적 파일)
 *   2순위: GitHub Trees API + raw.githubusercontent.com 직접 fetch (dev / fallback)
 */

// ── 상수 ─────────────────────────────────────────────────────────────────────

const OWNER  = 'pelu10075';
const REPO   = 'codeforces';
const BRANCH = 'main';

const TREE_API  = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE  = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
export const BLOB_BASE = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}`;
export const TREE_BASE = `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`;
export const REPO_URL  = `https://github.com/${OWNER}/${REPO}`;

// ── 타입 ─────────────────────────────────────────────────────────────────────

export type ProblemEntry = {
	id: string;
	title: string;
	round: number;
	round_name: string;
	type: 'problem';
	tags: string[];
	/** 0 = unrated / unknown */
	difficulty: number;
};

export type ContestEntry = {
	round: number;
	round_name: string;
	type: 'contest';
	problems: string[];
	date: string;
	slug: string;
};

export type Entry = ProblemEntry | ContestEntry;

export type SearchResult = {
	problems: ProblemEntry[];
	contests: ContestEntry[];
	mode: 'split' | 'merged';
};

// ── parseFrontmatter ──────────────────────────────────────────────────────────

export function parseFrontmatter(raw: string): Record<string, unknown> | null {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return null;
	const result: Record<string, unknown> = {};
	for (const line of m[1].split(/\r?\n/)) {
		const ci = line.indexOf(':');
		if (ci === -1) continue;
		const key = line.slice(0, ci).trim();
		const val = line.slice(ci + 1).trim();
		if (!key) continue;
		if (/^\[.*\]$/.test(val)) {
			result[key] = val
				.slice(1, -1)
				.split(',')
				.map((s) => s.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean);
		} else if (/^-?\d+(\.\d+)?$/.test(val)) {
			result[key] = Number(val);
		} else {
			result[key] = val.replace(/^["']|["']$/g, '');
		}
	}
	return Object.keys(result).length ? result : null;
}

// ── 모듈 캐시 ─────────────────────────────────────────────────────────────────

let _cache: Entry[] | null = null;

// ── loadEntries ───────────────────────────────────────────────────────────────

export async function loadEntries(): Promise<Entry[]> {
	if (_cache) return _cache;

	// 1순위: 정적 JSON (빌드 시 생성, 1 fetch)
	try {
		const res = await fetch('/cf-data.json');
		if (res.ok) {
			const { entries } = (await res.json()) as { entries: Entry[] };
			if (Array.isArray(entries) && entries.length > 0) {
				_cache = entries;
				return entries;
			}
		}
	} catch {
		// 정적 파일 없음 → live API fallback
	}

	// 2순위: GitHub API live fetch (dev 환경 또는 정적 파일 없는 경우)
	const treeRes = await fetch(TREE_API, {
		headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
	});
	if (!treeRes.ok) throw new Error(`Trees API ${treeRes.status}`);
	const { tree } = (await treeRes.json()) as { tree: { path: string; type: string }[] };

	const notePaths = tree
		.filter(
			(n) =>
				n.type === 'blob' &&
				(n.path.match(/^problems\/[^/]+\/note\.md$/) ||
					n.path.match(/^contests\/[^/]+\/notes\.md$/)),
		)
		.map((n) => n.path);

	const settled = await Promise.allSettled(
		notePaths.map((p) => fetch(`${RAW_BASE}/${p}`).then((r) => ({ path: p, text: r.text() }))),
	);

	const entries: Entry[] = [];

	for (const result of settled) {
		if (result.status === 'rejected') continue;
		const { path, text: textPromise } = result.value;
		let raw: string;
		try { raw = await textPromise; } catch { continue; }
		const fm = parseFrontmatter(raw);
		if (!fm) continue;

		if (fm.type === 'problem' && fm.id) {
			const d = Number(fm.difficulty);
			entries.push({
				type:       'problem',
				id:         String(fm.id),
				title:      String(fm.title ?? ''),
				round:      Number(fm.round ?? 0),
				round_name: String(fm.round_name ?? ''),
				tags:       Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
				difficulty: isNaN(d) ? 0 : d,
			});
		} else if (fm.type === 'contest') {
			const parts = path.split('/');
			entries.push({
				type:       'contest',
				round:      Number(fm.round ?? 0),
				round_name: String(fm.round_name ?? ''),
				problems:   Array.isArray(fm.problems) ? (fm.problems as string[]) : [],
				date:       String(fm.date ?? ''),
				slug:       parts[1] ?? '',
			});
		}
	}

	entries.sort((a, b) => {
		if (a.type === 'problem' && b.type === 'problem') return a.id.localeCompare(b.id);
		if (a.type === 'contest' && b.type === 'contest') return b.round - a.round;
		return a.type === 'contest' ? -1 : 1;
	});

	_cache = entries;
	return entries;
}

// ── performSearch ─────────────────────────────────────────────────────────────

export function performSearch(query: string, entries: Entry[]): SearchResult {
	const q    = query.trim();
	const ql   = q.toLowerCase();
	const all  = entries.filter((e): e is ProblemEntry => e.type === 'problem');
	const cons = entries.filter((e): e is ContestEntry => e.type === 'contest');

	if (!q) return { problems: all, contests: cons, mode: 'merged' };

	if (/^\d+$/.test(q)) {
		const n = parseInt(q, 10);
		return {
			contests: cons.filter((c) => c.round === n),
			problems: all.filter((p) => p.round === n || p.id.toLowerCase().startsWith(ql)),
			mode: 'split',
		};
	}

	if (/^\d+[A-Za-z][1-9]?$/.test(q)) {
		return {
			problems: all.filter((p) => p.id.toLowerCase().startsWith(ql)),
			contests: [],
			mode: 'merged',
		};
	}

	if (/^[A-Za-z][1-9]?$/.test(q)) {
		const letter = q.toUpperCase();
		return {
			problems: all.filter((p) => p.id.replace(/^\d+/, '').toUpperCase() === letter),
			contests: [],
			mode: 'merged',
		};
	}

	return {
		problems: all.filter(
			(p) =>
				p.title.toLowerCase().includes(ql) ||
				p.tags.some((t) => t.toLowerCase().includes(ql)),
		),
		contests: [],
		mode: 'merged',
	};
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
