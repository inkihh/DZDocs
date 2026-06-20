# Implementation — Content & information architecture

## Collection

`src/content.config.ts` defines a single `docs` collection using Starlight's `docsLoader()` and
`docsSchema()`. All pages live under `src/content/docs/` as Markdown (`.md`) or MDX (`.mdx`).
A page's URL slug is its path relative to `docs/` minus the extension (e.g.
`scripting/overview.md` → `/scripting/overview/`).

## Taxonomy (discipline-based)

Five top-level groups, configured in `astro.config.mjs` `sidebar`. Each group is
`{ label, collapsed, items: [{ autogenerate: { directory } }] }`, so the sidebar **autogenerates**
from the directory — adding a Markdown file is enough to extend the nav. "Getting Started" is
expanded (`collapsed: false`); the rest start collapsed to keep the panel tidy.

| Group | Directory | Collapsed |
| --- | --- | --- |
| Getting Started | `getting-started/` | no |
| Scripting | `scripting/` | yes |
| Asset Work | `asset-work/` | yes |
| Tooling & Setup | `tooling-setup/` | yes |
| Contributing | `contributing/` | yes |

## Authoring conventions

- **Frontmatter:** every page has `title` and a one-line `description` (used for search + link
  previews). `sidebar.order` sets nav position within a group; `sidebar.label` overrides the
  nav label (each group's intro page uses `label: Overview`, `order: 1`).
- **Stub pages** (planned-but-unwritten) carry `sidebar.badge: { text: stub, variant: caution }`
  so they're visibly flagged in the nav, and open with a `:::caution[Planned page]` aside plus a
  "What this page will cover" outline. Filling a stub = remove the aside, remove the badge, write
  the content. This is the Milestone-2 content roadmap.
- **Cross-linking** is heavy and deliberate (scripting ↔ asset work overlap). Use root-relative
  links (`/asset-work/p3d-setup/`).
- **Hazard divider:** `<hr class="hazard" />` renders the amber chevron rule (styled in
  `theme.css`); used on the landing page.
- **Research notes:** page content is grounded in research captured under `resources/research/`
  (one file per topic, e.g. `onboarding-*.md`) and indexed from `RESEARCH.md` — internal working
  notes, not published pages. Primary grounding is the maintainer's local DayZ skills (see
  CONCEPT.md "Authoring resources") and the BI Community Wiki.

## Page inventory (30)

- **Landing:** `index.mdx` — `template: splash`, custom hero (`hero.svg`), discipline `LinkCard`
  grid, and "why this exists" `Card` grid.
- **getting-started/** — `overview` (Start here), `modding-overview`, `workbench-setup`,
  `how-to-contribute` — all written (no stubs).
- **scripting/** — `overview`, `enscript-basics` (stub), `common-gotchas` (stub),
  `engine-subsystems` (stub), `game-structure` (stub).
- **asset-work/** — `overview`, `p3d-setup` (stub, flagged top priority), `proxies` (stub),
  `selections-and-naming` (stub), `memory-points` (stub), `materials-rvmat` (stub), `textures`
  (stub), `configs` (stub).
- **tooling-setup/** — `overview`, `packing` (stub), `file-patching` (stub), `publishing` (stub),
  `project-workflow` (stub).
- **contributing/** — `overview`, `writing-docs`, `style-guide` (stub), `pr-process`.
- **Root pages (footer-linked, not in the discipline sidebar):** `contact`, `privacy`, `sources`.
  `sources` credits the external references content is grounded in — open-source skills like
  `dayz-dev-plugin` (GPL-3.0), the BI Community Wiki, and DayZ Tools — and is reached from the
  site footer (see `Footer.astro` in [theming.md](theming.md)).

Overview pages, the full Getting-Started section, and the Contributing pages carry real content;
the discipline deep-dives (scripting, asset work, tooling) are mostly clearly-badged stubs.
