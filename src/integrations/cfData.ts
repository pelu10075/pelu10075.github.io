/**
 * Astro integration — Codeforces 문제 데이터를 빌드 시 정적 JSON으로 생성
 *
 * 빌드 전 GitHub Trees API + raw.githubusercontent.com에서 note.md를 일괄 fetch,
 * frontmatter를 파싱해 public/cf-data.json에 저장한다.
 * 런타임 클라이언트는 이 파일 1개만 fetch하면 된다 (N+1 → 1).
 */

import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const OWNER  = 'pelu10075';
const REPO   = 'codeforces';
const BRANCH = 'main';
const TREE_API = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;

function parseFrontmatter(raw: string): Record<string, unknown> | null {
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

export function cfDataIntegration(): AstroIntegration {
	return {
		name: 'cf-data',
		hooks: {
			'astro:build:start': async ({ logger }) => {
				logger.info('Fetching Codeforces problem data…');
				try {
					// 1. Trees API
					const treeRes = await fetch(TREE_API, {
						headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
					});
					if (!treeRes.ok) throw new Error(`Trees API ${treeRes.status}`);
					const { tree } = (await treeRes.json()) as { tree: { path: string; type: string }[] };

					// 2. note.md 경로 추출
					const notePaths = tree
						.filter(
							(n) =>
								n.type === 'blob' &&
								(n.path.match(/^problems\/[^/]+\/note\.md$/) ||
									n.path.match(/^contests\/[^/]+\/notes\.md$/)),
						)
						.map((n) => n.path);

					// 3. 병렬 fetch
					const settled = await Promise.allSettled(
						notePaths.map((p) =>
							fetch(`${RAW_BASE}/${p}`).then(async (r) => ({ path: p, text: await r.text() })),
						),
					);

					type Entry = Record<string, unknown>;
					const entries: Entry[] = [];

					for (const result of settled) {
						if (result.status === 'rejected') continue;
						const { path, text } = result.value;
						const fm = parseFrontmatter(text);
						if (!fm) continue;

						if (fm.type === 'problem' && fm.id) {
							const d = Number(fm.difficulty);
							entries.push({
								type:       'problem',
								id:         String(fm.id),
								title:      String(fm.title ?? ''),
								round:      Number(fm.round ?? 0),
								round_name: String(fm.round_name ?? ''),
								tags:       Array.isArray(fm.tags) ? fm.tags : [],
								difficulty: isNaN(d) ? 0 : d,
							});
						} else if (fm.type === 'contest') {
							const parts = path.split('/');
							entries.push({
								type:       'contest',
								round:      Number(fm.round ?? 0),
								round_name: String(fm.round_name ?? ''),
								problems:   Array.isArray(fm.problems) ? fm.problems : [],
								date:       String(fm.date ?? ''),
								slug:       parts[1] ?? '',
							});
						}
					}

					// 정렬
					entries.sort((a, b) => {
						if (a.type === 'problem' && b.type === 'problem')
							return String(a.id).localeCompare(String(b.id));
						if (a.type === 'contest' && b.type === 'contest')
							return Number(b.round) - Number(a.round);
						return a.type === 'contest' ? -1 : 1;
					});

					const json = JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2);
					const outPath = resolve('public/cf-data.json');
					await writeFile(outPath, json, 'utf-8');
					logger.info(`cf-data.json written — ${entries.length} entries`);
				} catch (err) {
					logger.warn(`cf-data.json generation failed: ${err}. Falling back to live API at runtime.`);
				}
			},
		},
	};
}
