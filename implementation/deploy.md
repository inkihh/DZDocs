# Implementation — Deployment & onboarding

## Hosting: GitHub Pages

The site is a static build published to **GitHub Pages** from `inkihh/wardog-site-experiment`.

### Workflow — `.github/workflows/deploy.yml`

- **Triggers:** `push` to `main`, plus manual `workflow_dispatch`.
- **Permissions (least privilege):** `contents: read`, `pages: write`, `id-token: write`.
- **Concurrency:** group `pages`, `cancel-in-progress: false` (let an in-flight deploy finish).
- **`build` job:** `actions/checkout@v4` → `withastro/action@v3` (`node-version: 22`) — installs
  deps, runs `astro build`, uploads `./dist` as the Pages artifact.
- **`deploy` job:** `needs: build`, environment `github-pages`, `actions/deploy-pages@v4`.

So **every push to `main` rebuilds and redeploys** the live site.

## Domain & TLS

- **Custom domain:** `public/CNAME` = `dayzmodders.inkihh.de`. Copied to `dist/CNAME` at build and
  consumed by GitHub Pages. The site serves at the **domain root** → `astro.config.mjs` sets no
  `base`, and `site: 'https://dayzmodders.inkihh.de'`.
- **DNS:** the `inkihh.de` zone is on Hetzner nameservers; `dayzmodders.inkihh.de` must point at
  GitHub Pages (a `CNAME` to `inkihh.github.io`). HTTPS uses a GitHub-provisioned, auto-renewing
  Let's Encrypt certificate.

## `public/_headers` — inert (legacy)

`public/_headers` (immutable-asset caching + baseline security headers) is a **Cloudflare/Netlify**
feature. GitHub Pages **ignores** it — it is served as a static file at `/_headers` and has no
effect. Left over from the dropped Cloudflare Pages plan; a candidate for removal or replacement
with a Pages-compatible approach.

## Build output

`astro build` → `dist/`: static HTML per page, hashed assets under `_astro/`, the Pagefind search
index under `pagefind/`, `sitemap-index.xml`, and `CNAME`. Top-level repo docs (`README.md`,
`CONCEPT.md`, `IMPLEMENTATION.md`, `TASK.md`, `implementation/`) are **not** part of the build —
only `src/content/docs/` is rendered.

## Contributor onboarding

- **`README.md`** — what it is, stack, local dev, project structure, GitHub Pages deploy table.
- **`CONTRIBUTING.md`** — repo-level quick start; links to the on-site Contributing section.
- **`.github/PULL_REQUEST_TEMPLATE.md`** — change summary, type, and accuracy/EULA/original-asset
  checklist.
