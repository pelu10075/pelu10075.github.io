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
