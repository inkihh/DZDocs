/*
 * Per-page contributor generator (build-time).
 *
 * For every documentation page under src/content/docs/, asks the GitHub REST API
 * who has committed to that file and writes the result to src/data/contributors.json,
 * keyed by the page's repo-root-relative path (e.g. "src/content/docs/scripting/
 * enscript-basics.md") — the same `entry.filePath` Starlight exposes to the
 * PageSidebar override that renders the list.
 *
 * Why the API instead of `git log`: it resolves each commit's author to a real
 * GitHub account (handle + avatar + profile), collapses a person's multiple commit
 * emails into one identity, and needs no git history — so CI can keep the default
 * shallow checkout (fetch-depth: 1).
 *
 * Attribution rules:
 *   - Skip merge commits (parents.length > 1) — whoever clicks "merge" never lands
 *     in the list. For squash / rebase / merge-commit PRs the resolved author is the
 *     PR creator, so contributors are credited correctly even on browser merges.
 *   - Count = number of non-merge commits touching the page.
 *   - Skip bot accounts and commits whose author email isn't linked to a GitHub user.
 *
 * Runs before `astro build` (see package.json). In CI the Actions-provided
 * GITHUB_TOKEN (job env) and GITHUB_REPOSITORY are used automatically. Locally with
 * no token it skips the network and leaves a seed file so the build never fails.
 */
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = path.join(root, 'src/content/docs');
const OUT_FILE = path.join(root, 'src/data/contributors.json');
const API = 'https://api.github.com';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);

const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

function resolveRepo() {
	const envRepo = process.env.GITHUB_REPOSITORY; // "owner/repo" in GitHub Actions
	if (envRepo && envRepo.includes('/')) {
		const [owner, repo] = envRepo.split('/');
		return { owner, repo };
	}
	const m = (pkg.repository?.url || '').match(/github\.com[/:]([^/]+)\/([^/.]+)/);
	if (m) return { owner: m[1], repo: m[2] };
	return { owner: 'inkihh', repo: 'DZDocs' };
}

function headers() {
	const h = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'dzdocs-contributors-build',
		'X-GitHub-Api-Version': '2022-11-28',
	};
	if (token) h.Authorization = `Bearer ${token}`;
	return h;
}

// Pull the rel="next" URL out of a GitHub Link header for pagination.
function nextLink(linkHeader) {
	if (!linkHeader) return null;
	for (const part of linkHeader.split(',')) {
		const m = part.match(/<([^>]+)>;\s*rel="next"/);
		if (m) return m[1];
	}
	return null;
}

// Recursively collect .md / .mdx pages, returning repo-root-relative POSIX paths.
async function listDocs(dir) {
	const out = [];
	async function walk(d) {
		for (const entry of await readdir(d, { withFileTypes: true })) {
			const full = path.join(d, entry.name);
			if (entry.isDirectory()) await walk(full);
			else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
				out.push(path.relative(root, full).split(path.sep).join('/'));
			}
		}
	}
	await walk(dir);
	return out.sort();
}

async function contributorsFor(owner, repo, filePath) {
	const byLogin = new Map();
	let url = `${API}/repos/${owner}/${repo}/commits?path=${encodeURIComponent(
		filePath
	)}&per_page=100`;
	while (url) {
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
		for (const commit of await res.json()) {
			if (Array.isArray(commit.parents) && commit.parents.length > 1) continue; // merge commit
			const author = commit.author; // resolved GitHub account, or null if email unlinked
			if (!author || !author.login) continue;
			if (author.type === 'Bot' || author.login.endsWith('[bot]')) continue;
			const existing = byLogin.get(author.login);
			if (existing) existing.count += 1;
			else
				byLogin.set(author.login, {
					login: author.login,
					count: 1,
					avatarUrl: author.avatar_url,
					profileUrl: author.html_url,
				});
		}
		url = nextLink(res.headers.get('link'));
	}
	return [...byLogin.values()].sort(
		(a, b) => b.count - a.count || a.login.localeCompare(b.login)
	);
}

async function ensureSeed() {
	try {
		await access(OUT_FILE);
	} catch {
		await mkdir(path.dirname(OUT_FILE), { recursive: true });
		await writeFile(OUT_FILE, '{}\n');
	}
}

const files = await listDocs(DOCS_DIR);

if (!token && !isCI) {
	console.log(
		'[contributors] No GITHUB_TOKEN and not in CI — skipping fetch; pages show no contributors locally.'
	);
	await ensureSeed();
	process.exit(0);
}

const { owner, repo } = resolveRepo();
console.log(`[contributors] ${owner}/${repo}: querying ${files.length} page(s)…`);

const map = {};
let failures = 0;
for (const rel of files) {
	try {
		const contributors = await contributorsFor(owner, repo, rel);
		if (contributors.length) map[rel] = contributors;
		console.log(`[contributors]   ${rel}: ${contributors.length}`);
	} catch (err) {
		failures += 1;
		console.warn(`[contributors]   WARN ${rel}: ${err.message}`);
		if (!token && /\b403\b/.test(err.message)) {
			console.warn('[contributors] Unauthenticated rate limit hit — stopping early.');
			break;
		}
	}
}

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(map, null, 2) + '\n');
console.log(
	`[contributors] Wrote ${Object.keys(map).length} page(s) to ${path.relative(root, OUT_FILE)}` +
		(failures ? ` (${failures} failed)` : '') +
		'.'
);
