// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages is the production host. It's a project site, so the whole site is
// served from a sub-path rather than a domain root — `base` carries that everywhere.
const SITE = 'https://inkihh.github.io';
const BASE = '/wardog-site-experiment';

// Source repository — drives the GitHub social link and per-page "Edit" links.
const REPO = 'https://github.com/inkihh/wardog-site-experiment';

// Starlight base-prefixes the links it generates (sidebar, asset URLs, routing), but
// it leaves root-absolute links written in page content (`/foo/`) literal — and those
// would 404 under the sub-path. This rehype pass prepends the base to in-content
// absolute links, so docs can keep linking the natural, base-agnostic way.
function rehypeBaseLinks() {
	return (tree) => {
		const walk = (node) => {
			if (
				node.type === 'element' &&
				node.tagName === 'a' &&
				typeof node.properties?.href === 'string'
			) {
				const href = node.properties.href;
				if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith(`${BASE}/`)) {
					node.properties.href = `${BASE}${href}`;
				}
			}
			node.children?.forEach(walk);
		};
		walk(tree);
	};
}

// Open every link that points to GitHub in a new tab. Covers them all in one
// place — the header social icon, the hero button, per-page "Edit" links, and
// inline content links — regardless of which component rendered them.
const OPEN_GITHUB_IN_NEW_TAB = `
(() => {
	const fix = () => {
		for (const a of document.querySelectorAll('a[href]')) {
			let host;
			try { host = new URL(a.href, location.href).hostname; } catch (e) { continue; }
			if (host === 'github.com' || host.endsWith('.github.com')) {
				a.target = '_blank';
				const rel = new Set((a.getAttribute('rel') || '').split(/\\s+/).filter(Boolean));
				rel.add('noopener'); rel.add('noreferrer');
				a.setAttribute('rel', [...rel].join(' '));
			}
		}
	};
	if (document.readyState !== 'loading') fix();
	else document.addEventListener('DOMContentLoaded', fix);
	document.addEventListener('astro:page-load', fix);
})();
`;

// https://astro.build/config
export default defineConfig({
	site: SITE,
	base: BASE,
	markdown: {
		rehypePlugins: [rehypeBaseLinks],
	},
	integrations: [
		starlight({
			title: 'DayZ Modders',
			description:
				'A community-maintained knowledge base for DayZ modding — scripting, asset work, tooling, and onboarding.',
			logo: {
				src: './src/assets/logo.svg',
				alt: 'DayZ Modders',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: REPO },
				// TODO: add the community Discord invite once a stable invite URL exists.
				// { icon: 'discord', label: 'Discord', href: 'https://discord.gg/...' },
			],
			editLink: {
				baseUrl: `${REPO}/edit/main/`,
			},
			lastUpdated: true,
			// Dark-only: force the dark theme and remove the theme switcher.
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			// Open all links to GitHub in a new tab.
			head: [{ tag: 'script', content: OPEN_GITHUB_IN_NEW_TAB }],
			// Fonts are self-hosted via @fontsource (no external runtime dependency),
			// then the theme is layered on top.
			customCss: [
				'@fontsource-variable/inter',
				'@fontsource-variable/oswald',
				'./src/styles/theme.css',
			],
			// Discipline-based taxonomy. Each group autogenerates from its directory,
			// so contributors only add a Markdown file to extend the nav. Groups are
			// collapsed by default to keep the sidebar tidy as content grows.
			sidebar: [
				{
					label: 'Getting Started',
					collapsed: false,
					items: [{ autogenerate: { directory: 'getting-started' } }],
				},
				{
					label: 'Scripting',
					collapsed: true,
					items: [{ autogenerate: { directory: 'scripting' } }],
				},
				{
					label: 'Asset Work',
					collapsed: true,
					items: [{ autogenerate: { directory: 'asset-work' } }],
				},
				{
					label: 'Tooling & Setup',
					collapsed: true,
					items: [{ autogenerate: { directory: 'tooling-setup' } }],
				},
				{
					label: 'Contributing',
					collapsed: true,
					items: [{ autogenerate: { directory: 'contributing' } }],
				},
			],
		}),
	],
});
