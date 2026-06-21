# Current Task

_No active task._

The previous task — **per-page contributors in the "On this page" sidebar** — is complete:
a build-time generator (`scripts/contributors.mjs`) queries the GitHub REST API for the commits
touching each page, credits the resolved **PR author** (skipping merge commits and bots, so the
person who merges a PR — including in the browser — isn't credited), and writes
`src/data/contributors.json` (git-ignored). A `PageSidebar` override renders the list — avatar ·
`@handle` · commit count, ordered by count — beneath the table of contents. It needs **no git
history**, so CI keeps its default shallow checkout; the deploy workflow just passes
`GITHUB_TOKEN` (job-level env) so `npm run build` can reach the API. Desktop-only (mirrors the TOC
panel); avatars load from GitHub's CDN at runtime. README/IMPLEMENTATION/CONCEPT updated.

Awaiting the next task.
