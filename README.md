# dayzmodders.net

A community-maintained knowledge base for **DayZ modding** — scripting, asset work,
tooling, and onboarding. Built by modders, for modders, and published as a fast,
static documentation site.

🔗 **Live site:** https://dayzmodders.net

> **Status: early foundation.** The site is scaffolded and themed, with the full
> discipline taxonomy in place. Most pages are stubs (flagged in the sidebar) waiting
> to be written — that's where contributors come in.

## What this is

DayZ modding knowledge is scattered across Discord, half-finished repos, videos, and
private mentorships — and often gatekept. This site gathers it into one durable,
searchable place: a curated, cross-linked reference for the hard-to-find side of
modding the game. It's not a Q&A forum and not an auto-generated API dump — it's a
deliberately built knowledge base, closer to good project docs than a wiki.

Content is authored in Markdown and contributed through pull requests.

## Tech stack

- **[Astro](https://astro.build/)** + **[Starlight](https://starlight.astro.build/)** — static documentation framework.
- **Dark-only brand theme** — navy palette and blue accent drawn from the community logo (no light mode / theme switcher).
- **Self-hosted fonts** via `@fontsource` (Inter for body, Oswald for display).
- **Built-in search** — Starlight ships Pagefind search that works on every build.
  (A move to Algolia is planned once there's enough content; see below.)
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — CDN-backed hosting.

## Local development

Requires **Node `>=20.3.0`** (see [`.nvmrc`](./.nvmrc) — currently Node 22).

```sh
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # serve the production build locally
```

## Project structure

| Path | What |
| --- | --- |
| `src/content/docs/` | All documentation pages, grouped by discipline |
| `src/content/docs/index.mdx` | Landing / hero page |
| `astro.config.mjs` | Site config + the sidebar taxonomy |
| `src/styles/theme.css` | Site theme (palette, typography, hero, cards) |
| `src/assets/` | Brand artwork — `logo` (mark), `hero`, `app-icon` |
| `src/components/` | Starlight component overrides (dark-only: forced theme, no switcher) |
| `public/` | Static files served as-is (`favicon.svg`, `_headers`) |
| `CONTRIBUTING.md` | Contributor quick start |

The sidebar is organized **by discipline** and **autogenerates** from each directory
under `src/content/docs/`, so adding a Markdown file is enough to extend the nav:

- **Getting Started** · **Scripting** · **Asset Work** · **Tooling & Setup** · **Contributing**

## Contributing

If you can write Markdown, you can contribute — no repo access needed. See
**[CONTRIBUTING.md](./CONTRIBUTING.md)** for the quick start, or the
[Contributing section](https://dayzmodders.net/contributing/overview/) on the site for
the full guidance.

**House rules:** quality over volume · respect the DayZ EULA (no de-binarization /
DeODOL) · original or vanilla assets only.

## Deployment (Cloudflare Pages)

The site is a static build deployed to Cloudflare Pages. Recommended project settings:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (from `.nvmrc`, or set `NODE_VERSION=22`) |
| Production branch | `main` |
| Custom domain | `dayzmodders.net` |

Caching and security response headers are configured in
[`public/_headers`](./public/_headers) (long-lived immutable caching for hashed assets,
baseline security headers for everything else). `astro.config.mjs` sets
`site: 'https://dayzmodders.net'`, which drives the generated sitemap and canonical
URLs — update it if the domain changes.

> Nothing here triggers a deploy on its own. Wiring the GitHub repo to a Cloudflare
> Pages project and pointing the domain is a one-time infrastructure step done outside
> this repo.

## License

Documentation content is intended to be shared — **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.
This is a community project and not affiliated with or endorsed by Bohemia Interactive.
