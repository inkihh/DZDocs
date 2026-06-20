# Implementation — Deployment & onboarding

## Hosting: GitHub Pages

The site is a static build published to **GitHub Pages** from `inkihh/DZDocs`.

### Workflow — `.github/workflows/deploy.yml`

- **Triggers:** `push` to `main`, plus manual `workflow_dispatch`.
- **Permissions (least privilege):** `contents: read`, `pages: write`, `id-token: write`.
- **Concurrency:** group `pages`, `cancel-in-progress: false` (let an in-flight deploy finish).
- **`build` job:** `actions/checkout@v4` → `withastro/action@v3` (`node-version: 22`) — installs
  deps, runs `astro build`, uploads `./dist` as the Pages artifact.
- **`deploy` job:** `needs: build`, environment `github-pages`, `actions/deploy-pages@v4`.

So **every push to `main` rebuilds and redeploys** the live site.

## Domain & TLS

- **Custom domain:** `public/CNAME` = `dzdocs.inkihh.de`. Copied to `dist/CNAME` at build and
  consumed by GitHub Pages. The site serves at the **domain root** → `astro.config.mjs` sets no
  `base`, and `site: 'https://dzdocs.inkihh.de'`. The Pages custom domain can be set either by the
  deployed `CNAME` file or directly via the API (`PUT /repos/inkihh/DZDocs/pages`, field `cname`).
- **DNS:** the `inkihh.de` zone is hosted on **Hetzner DNS**, managed via the Hetzner Cloud API
  (`api.hetzner.cloud/v1/zones`, Bearer auth — the standalone `dns.hetzner.com/api/v1` endpoint is
  retired). `dzdocs.inkihh.de` is a `CNAME` to `inkihh.github.io.` (ttl 300). HTTPS uses a
  GitHub-provisioned, auto-renewing Let's Encrypt certificate.

## Response headers

GitHub Pages does not support custom response headers (no `_headers` / `netlify.toml` / nginx
equivalent), so the site sets none. A legacy Cloudflare-format `public/_headers` (baseline
security headers + immutable-asset caching) used to live in the repo but was inert under Pages —
served as a plain file at `/_headers` — and has been **removed**. If custom headers are ever
required (HSTS, CSP, long-lived asset caching), the site would need a proxy/CDN in front of Pages
(e.g. Cloudflare) or a different host.

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
