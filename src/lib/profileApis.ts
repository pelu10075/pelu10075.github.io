/** 빌드 타임에만 사용 — GitHub / Codeforces 공개 API */

export type GitHubUser = {
	login: string;
	html_url: string;
	bio: string | null;
	blog: string | null;
	public_repos: number;
	name: string | null;
	avatar_url: string;
	followers: number;
	following: number;
};

export type GitHubRepo = {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	fork: boolean;
	language: string | null;
	topics: string[];
	stargazers_count: number;
	updated_at: string;
};

export type CodeforcesUser = {
	handle: string;
	rating?: number;
	maxRating?: number;
	rank?: string;
	maxRank?: string;
};

const ghHeaders = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
} as const;

export async function fetchGitHubUser(login: string): Promise<GitHubUser | null> {
	try {
		const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
			headers: ghHeaders,
		});
		if (!res.ok) return null;
		return (await res.json()) as GitHubUser;
	} catch {
		return null;
	}
}

export async function fetchGitHubRepos(login: string, limit: number): Promise<GitHubRepo[]> {
	try {
		const res = await fetch(
			`https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=${limit}&sort=updated&type=owner`,
			{ headers: ghHeaders },
		);
		if (!res.ok) return [];
		const data = (await res.json()) as GitHubRepo[];
		return data.filter((r) => !r.fork);
	} catch {
		return [];
	}
}

export type CfTreeBlob = {
	path: string;
	/** file name without extension */
	name: string;
	/** 'problem' | 'contest-problem' */
	kind: 'problem' | 'contest-problem';
	/** for kind=contest-problem: raw folder name, e.g. "round_1094_div1+2" */
	round?: string;
	/** human-friendly round label, e.g. "Round 1094 (Div. 1+2)" */
	roundLabel?: string;
	/** display id, e.g. "1234A" or "A" */
	id: string;
	/** GitHub blob URL */
	githubUrl: string;
	/** lowercase search index string */
	searchText: string;
};

function parseRoundLabel(folder: string): string {
	// "round_1094_div1+2" → "Round 1094 (Div. 1+2)"
	const m = folder.match(/^round[_-](\d+)(?:[_-](div\d[\+\-]?\d*))?/i);
	if (!m) return folder.replace(/_/g, ' ');
	const num = m[1];
	const div = m[2] ? m[2].replace('div', 'Div. ') : null;
	return div ? `Round ${num} (${div})` : `Round ${num}`;
}

export async function fetchCodeforcesRepoTree(owner: string): Promise<CfTreeBlob[]> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${owner}/codeforces/git/trees/main?recursive=1`,
			{ headers: ghHeaders },
		);
		if (!res.ok) return [];
		const json = (await res.json()) as { tree: { path: string; type: string }[] };
		const blobs = json.tree.filter((n) => n.type === 'blob');
		const base = `https://github.com/${owner}/codeforces/blob/main`;
		const results: CfTreeBlob[] = [];
		for (const b of blobs) {
			const parts = b.path.split('/');
			if (parts[0] === 'problems' && parts.length === 2) {
				const name = parts[1].replace(/\.[^.]+$/, '');
				results.push({
					path: b.path,
					name,
					kind: 'problem',
					id: name,
					githubUrl: `${base}/${b.path}`,
					searchText: name.toLowerCase(),
				});
			} else if (parts[0] === 'contests' && parts.length === 3) {
				const folder = parts[1];
				const name = parts[2].replace(/\.[^.]+$/, '');
				const label = parseRoundLabel(folder);
				results.push({
					path: b.path,
					name,
					kind: 'contest-problem',
					round: folder,
					roundLabel: label,
					id: name,
					githubUrl: `${base}/${b.path}`,
					searchText: [name, folder, label].join(' ').toLowerCase(),
				});
			}
		}
		return results;
	} catch {
		return [];
	}
}

type CfApiUser = {
	handle: string;
	rating?: number;
	maxRating?: number;
	rank?: string;
	maxRank?: string;
};

export async function fetchCodeforcesUser(handle: string): Promise<CodeforcesUser | null> {
	try {
		const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`;
		const res = await fetch(url);
		if (!res.ok) return null;
		const json = (await res.json()) as { status: string; result?: CfApiUser[] };
		if (json.status !== 'OK' || !json.result?.[0]) return null;
		const u = json.result[0];
		return {
			handle: u.handle,
			rating: u.rating,
			maxRating: u.maxRating,
			rank: u.rank,
			maxRank: u.maxRank,
		};
	} catch {
		return null;
	}
}
