/**
 * Codeforces 문제 풀이 저장소 — 런타임 데이터 페치 및 스마트 검색 로직
 *
 * 저장소 구조:
 *   problems/{id}/          note.md + solution.*
 *   contests/{roundSlug}/   notes.md + A.cpp …
 *   templates/              template.*
 */

// ── Config ───────────────────────────────────────────────────────────────────

export const CF_REPO = {
	owner: 'pelu10075',
	name: 'codeforces',
	branch: 'main',
} as const;

const TREE_API = `https://api.github.com/repos/${CF_REPO.owner}/${CF_REPO.name}/git/trees/${CF_REPO.branch}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${CF_REPO.owner}/${CF_REPO.name}/${CF_REPO.branch}`;
export const BLOB_BASE = `https://github.com/${CF_REPO.owner}/${CF_REPO.name}/blob/${CF_REPO.branch}`;
export const REPO_URL = `https://github.com/${CF_REPO.owner}/${CF_REPO.name}`;

const GH_HEADERS: HeadersInit = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
};

// ── Types ────────────────────────────────────────────────────────────────────

export type SolutionFile = { name: string; url: string };

export type ProblemItem = {
	type: 'problem';
	id: string;
	title: string;
	round: number;
	roundName: string;
	tags: string[];
	difficulty?: number;
	path: string;
	solutions: SolutionFile[];
};

export type ContestItem = {
	type: 'contest';
	round: number;
	roundName: string;
	problems: string[];
	date?: string;
	path: string;
	solutions: SolutionFile[];
};

export type CfItem = ProblemItem | ContestItem;

export type SearchResult = {
	rounds: ContestItem[];
	problems: ProblemItem[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const CODE_EXTS = new Set(['py', 'cpp', 'cc', 'cxx', 'c', 'java', 'kt', 'js', 'ts', 'go', 'rs', 'rb', 'cs', 'd']);

export function isCodeFile(name: string): boolean {
	if (name.startsWith('.')) return false;
	const ext = name.split('.').pop()?.toLowerCase() ?? '';
	return CODE_EXTS.has(ext);
}

/** 간단한 YAML frontmatter 파서 (gray-matter 불필요) */
export function parseFrontmatter(content: string): Record<string, unknown> {
	const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return {};
	const result: Record<string, unknown> = {};
	for (const line of m[1].split('\n')) {
		const ci = line.indexOf(':');
		if (ci === -1) continue;
		const key = line.slice(0, ci).trim();
		const val = line.slice(ci + 1).trim();
		if (!key) continue;
		if (val.startsWith('[')) {
			result[key] = val
				.slice(1, -1)
				.split(',')
				.map((s) => s.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean);
		} else if (/^\d+$/.test(val)) {
			result[key] = parseInt(val, 10);
		} else {
			result[key] = val.replace(/^["']|["']$/g, '');
		}
	}
	return result;
}

// ── Data Loading ─────────────────────────────────────────────────────────────

export type RepoLoadState =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'ok'; items: CfItem[] }
	| { status: 'error'; message: string };

export async function loadRepoData(): Promise<CfItem[]> {
	const treeRes = await fetch(TREE_API, { headers: GH_HEADERS });
	if (!treeRes.ok) throw new Error(`Tree API ${treeRes.status}`);
	const { tree } = (await treeRes.json()) as { tree: { path: string; type: string }[] };

	// Bucket by directory (only depth-3 files: problems/{id}/{file})
	const problemDirs = new Map<string, string[]>();
	const contestDirs = new Map<string, string[]>();

	for (const node of tree) {
		if (node.type !== 'blob') continue;
		const parts = node.path.split('/');
		if (parts[0] === 'problems' && parts.length === 3) {
			const dir = `${parts[0]}/${parts[1]}`;
			if (!problemDirs.has(dir)) problemDirs.set(dir, []);
			problemDirs.get(dir)!.push(parts[2]);
		} else if (parts[0] === 'contests' && parts.length === 3) {
			const dir = `${parts[0]}/${parts[1]}`;
			if (!contestDirs.has(dir)) contestDirs.set(dir, []);
			contestDirs.get(dir)!.push(parts[2]);
		}
	}

	const items: CfItem[] = [];

	// Fetch all note.md files in parallel via raw.githubusercontent.com (no rate limit)
	const fetches: Promise<void>[] = [];

	for (const [dir, files] of problemDirs) {
		if (!files.includes('note.md')) continue;
		fetches.push(
			fetch(`${RAW_BASE}/${dir}/note.md`)
				.then((r) => r.text())
				.then((raw) => {
					const fm = parseFrontmatter(raw);
					if (fm.type !== 'problem' || !fm.id) return;
					items.push({
						type: 'problem',
						id: String(fm.id),
						title: String(fm.title ?? ''),
						round: Number(fm.round ?? 0),
						roundName: String(fm.round_name ?? ''),
						tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
						difficulty: fm.difficulty != null ? Number(fm.difficulty) : undefined,
						path: dir,
						solutions: files
							.filter(isCodeFile)
							.map((f) => ({ name: f, url: `${BLOB_BASE}/${dir}/${f}` })),
					});
				})
				.catch(() => {}),
		);
	}

	for (const [dir, files] of contestDirs) {
		if (!files.includes('notes.md')) continue;
		fetches.push(
			fetch(`${RAW_BASE}/${dir}/notes.md`)
				.then((r) => r.text())
				.then((raw) => {
					const fm = parseFrontmatter(raw);
					if (fm.type !== 'contest') return;
					items.push({
						type: 'contest',
						round: Number(fm.round ?? 0),
						roundName: String(fm.round_name ?? ''),
						problems: Array.isArray(fm.problems) ? (fm.problems as string[]) : [],
						date: fm.date ? String(fm.date) : undefined,
						path: dir,
						solutions: files
							.filter(isCodeFile)
							.map((f) => ({ name: f, url: `${BLOB_BASE}/${dir}/${f}` })),
					});
				})
				.catch(() => {}),
		);
	}

	await Promise.all(fetches);

	// Sort: problems by id, contests by round desc
	items.sort((a, b) => {
		if (a.type === 'problem' && b.type === 'problem') return a.id.localeCompare(b.id);
		if (a.type === 'contest' && b.type === 'contest') return b.round - a.round;
		return a.type === 'contest' ? -1 : 1;
	});

	return items;
}

// ── Search ───────────────────────────────────────────────────────────────────

type TokenType = 'round' | 'problemId' | 'problemLetter' | 'text';

function classifyToken(q: string): TokenType {
	if (/^\d+$/.test(q)) return 'round';
	if (/^\d+[A-Za-z][1-9]?$/.test(q)) return 'problemId';
	if (/^[A-Za-z][1-9]?$/.test(q)) return 'problemLetter';
	return 'text';
}

export function performSearch(items: CfItem[], query: string): SearchResult {
	const q = query.trim();
	const allProblems = items.filter((i): i is ProblemItem => i.type === 'problem');
	const allContests = items.filter((i): i is ContestItem => i.type === 'contest');

	if (!q) return { rounds: allContests, problems: allProblems };

	const ql = q.toLowerCase();
	const kind = classifyToken(q);

	if (kind === 'round') {
		const n = parseInt(q, 10);
		return {
			rounds: allContests.filter((c) => c.round === n),
			problems: allProblems.filter((p) => p.round === n || p.id.toLowerCase().startsWith(ql)),
		};
	}
	if (kind === 'problemId') {
		return {
			rounds: [],
			problems: allProblems.filter((p) => p.id.toUpperCase().startsWith(q.toUpperCase())),
		};
	}
	if (kind === 'problemLetter') {
		return {
			rounds: [],
			problems: allProblems.filter((p) => {
				const letter = p.id.replace(/^\d+/, '').toUpperCase();
				return letter === q.toUpperCase();
			}),
		};
	}
	// text: tags + title
	return {
		rounds: [],
		problems: allProblems.filter(
			(p) =>
				p.title.toLowerCase().includes(ql) || p.tags.some((t) => t.toLowerCase().includes(ql)),
		),
	};
}

// ── Difficulty color ─────────────────────────────────────────────────────────

export function difficultyClass(d: number | undefined): string {
	if (d == null) return 'diff-none';
	if (d < 1200) return 'diff-grey';
	if (d < 1400) return 'diff-green';
	if (d < 1600) return 'diff-cyan';
	if (d < 1900) return 'diff-blue';
	if (d < 2100) return 'diff-purple';
	if (d < 2400) return 'diff-orange';
	return 'diff-red';
}
