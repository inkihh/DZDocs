# Implementation — Overview (architecture & build)

High-level technical map of the site. See [content.md](content.md), [theming.md](theming.md),
and [deploy.md](deploy.md) for the deeper per-area detail.

## Stack

- **[Astro](https://astro.build/) 6** + **[Starlight](https://starlight.astro.build/) 0.40** —
  static documentation framework. All pages are pre-rendered to static HTML.
- **Package manager:** npm. **Node:** `>=20.3.0` (`package.json` engines); `.nvmrc` pins `22`.
- **Search:** Pagefind (bundled with Starlight) — a static index built at `astro build`.
- **Sitemap:** generated automatically by Starlight from `site` (`sitemap-index.xml`).

### Dependencies (`package.json`, name `dzdocs`)

| Package | Range | Role |
| --- | --- | --- |
| `astro` | `^6.4.5` | Framework |
| `@astrojs/starlight` | `^0.40.0` | Docs theme/integration |
| `@fontsource-variable/inter` | `^5.2.8` | Body font (self-hosted) |
| `@fontsource-variable/oswald` | `^5.2.8` | Display font (self-hosted) |
| `sharp` | `^0.34.5` | Image optimization at build |

### Scripts

`dev`/`start` → `astro dev` (localhost:4321) · `build` → `node scripts/contributors.mjs && astro build`
(→ `dist/`) · `contributors` → `node scripts/contributors.mjs` (regenerate contributor data alone) ·
`preview` → `astro preview` · `astro` → CLI passthrough.

## Repo layout

```
astro.config.mjs            Site + Starlight config (see below)
tsconfig.json               extends astro/tsconfigs/strict
src/
  content.config.ts         docs collection: docsLoader() + docsSchema()
  content/docs/             All pages (see content.md)
  styles/theme.css          Dark-only theme (see theming.md)
  assets/                   logo-split.svg (active), hero.svg, app-icon.svg (build-processed)
  components/               ThemeProvider, ThemeSelect (dark-only), Banner, Footer, PageSidebar (see theming.md)
  data/contributors.json    Per-page contributors — generated at build, git-ignored
scripts/contributors.mjs    Build-time per-page contributor generator (see "Per-page contributors")
public/                     favicon.svg, CNAME (served as-is)
.github/workflows/deploy.yml  GitHub Pages CI (see deploy.md)
.github/PULL_REQUEST_TEMPLATE.md
README.md  CONTRIBUTING.md   Contributor onboarding
```

## `astro.config.mjs` breakdown

- `site: 'https://dzdocs.inkihh.de'` — canonical URL; drives sitemap, canonical links, OG.
  No `base` (served at the domain root). `REPO = 'https://github.com/inkihh/DZDocs'`.
- `integrations: [starlight({ ... })]`:
  - `title: 'DZDocs'`, `description`, `logo: { src: './src/assets/logo-split.svg', alt }`.
  - `social: [{ github → REPO }, { discord → https://discord.gg/EAMvFw9P93 }]`.
  - `editLink.baseUrl: ` `${REPO}/edit/main/` — per-page "Edit" links.
  - `lastUpdated: true` — uses git history for the per-page timestamp.
  - `components` — `ThemeProvider`, `ThemeSelect` (dark-only), `Banner` (draft strip), `Footer`
    (legal/contact + Sources row), `PageSidebar` (TOC + per-page contributors); see
    [theming.md](theming.md) and "Behavior: per-page contributors" below.
  - `head` — a single inline `<script>` (`OPEN_EXTERNAL_IN_NEW_TAB`); see below.
  - `customCss` — `@fontsource-variable/inter`, `@fontsource-variable/oswald`, then `./src/styles/theme.css`.
  - `sidebar` — five discipline groups. Four autogenerate (`items: [{ autogenerate: { directory } }]`);
    **Scripting is hand-tuned** — explicit slug entries plus a nested "Engine subsystems" group
    wrapping an autogenerate of `scripting/engine-subsystems/`. See [content.md](content.md).

## Behavior: open external links in a new tab

`OPEN_EXTERNAL_IN_NEW_TAB` is an inline head script injected on every page. On `DOMContentLoaded`
(and on `astro:page-load`) it walks every `<a href>`, resolves each against the current location,
and for any `http(s)` link whose host **differs from the current host** sets `target="_blank"` and
adds `rel="noopener noreferrer"`. Same-origin links and non-`http(s)` schemes are left untouched.
This covers the header social icons, hero buttons, per-page Edit links, footer links, and inline
content links in one place — chosen over per-component overrides.

## Behavior: per-page contributors

Each page's right-hand "On this page" panel lists the GitHub contributors to that page
(avatar · `@handle` · commit count, ordered by count). Two parts:

- **`scripts/contributors.mjs`** (build-time; the `build` npm script runs it before `astro build`).
  Walks `src/content/docs/` and, for each `.md`/`.mdx` page, queries the GitHub REST API
  `GET /repos/{owner}/{repo}/commits?path=<file>` (paginated). It tallies the resolved top-level
  `author.login` per commit — skipping **merge commits** (`parents.length > 1`), **bot** accounts,
  and commits whose author email isn't linked to a GitHub account — so a PR is credited to its
  **author**, not whoever merged it (squash/rebase/merge all preserve the author). Output:
  `src/data/contributors.json`, keyed by repo-root-relative path (`src/content/docs/...`), each
  value `[{ login, count, avatarUrl, profileUrl }]` sorted by count desc. Owner/repo come from
  `GITHUB_REPOSITORY` (else `package.json` `repository.url`); the token from `GITHUB_TOKEN`.
  **No git history is needed**, so CI keeps its default shallow checkout. With no token outside CI
  it skips the network and writes/keeps an empty seed, so local builds never fail (and `astro dev`,
  which doesn't run the generator, simply shows no contributors until a build has produced the file).
- **`src/components/PageSidebar.astro`** — Starlight override. Renders the default TOC panel, then —
  keyed by `Astro.locals.starlightRoute.entry.filePath` (the same path the generator keys on) —
  appends a **Contributors** block. It reads the JSON via `import.meta.glob` so a missing file
  degrades to "no contributors" instead of a build error. It lives in the right sidebar, which
  Starlight only renders at `lg+` width and only when the page has a TOC — so the splash landing page
  shows none, and the mobile TOC dropdown is left untouched. Avatars load from
  `avatars.githubusercontent.com` at runtime (the site's one third-party runtime request).

## History

- **Foundation (Milestone 1):** Astro+Starlight scaffold, discipline taxonomy, 27 starter pages,
  dark-only brand theme, contributor onboarding, deploy config.
- **Hosting pivot:** originally planned for Cloudflare Pages; moved to **GitHub Pages** + a
  custom domain on the `inkihh.de` zone.
- **Branding & UX:** adopted the **split-circle logo** for header + hero (earlier three-shard
  `logo.svg` removed); added an always-on **draft banner**, a footer **legal/contact + Sources**
  row, and a head script that opens **all external links** in a new tab.
- **Writing (Milestone 2, in progress):** wrote the Getting-Started onboarding pages
  (`modding-overview`, `workbench-setup`); added a `sources` page crediting external references;
  research notes captured under `resources/research/` (indexed from `RESEARCH.md`). Then wrote the
  full **Scripting** section — `enscript-basics`, `common-gotchas`, `game-structure`, and the new
  nested `engine-subsystems/` group (`overview`, `inventory`, `actions`, `networking`,
  `persistence`), replacing the old flat `engine-subsystems.md` stub and hand-tuning the Scripting
  sidebar group for the nested label.
- **Rebrand → DZDocs:** the project was renamed from its original branding to **DZDocs**.
  `astro.config.mjs` (`title`, `logo.alt`), all page copy, `package.json` (name `dzdocs`, homepage),
  brand-asset `aria-label`s, and the example PBO prefix (→ `Acme\ExampleMod`) were updated; the
  GitHub repo was renamed to **`inkihh/DZDocs`** (all in-repo URLs follow); and the community Discord
  link was replaced with the project invite (`discord.gg/EAMvFw9P93`).
- **Domain → `dzdocs.inkihh.de`:** `public/CNAME` and `astro.config.mjs` `site` updated. Hetzner DNS
  (`inkihh.de` zone, managed via `api.hetzner.cloud/v1`) got a `dzdocs` `CNAME → inkihh.github.io.`
  (ttl 300); the GitHub Pages custom domain was switched via `PUT /repos/inkihh/DZDocs/pages` with a
  fresh Let's Encrypt cert and HTTPS enforced; the previous domain's DNS record was removed.
- **Per-page contributors:** added a build-time generator (`scripts/contributors.mjs`) plus a
  `PageSidebar` override that list each page's GitHub contributors (handle + commit count) in the
  "On this page" panel; the deploy workflow passes `GITHUB_TOKEN` so CI can query the API, and the
  shallow checkout is retained (the generator needs no git history). See "Behavior: per-page
  contributors".
