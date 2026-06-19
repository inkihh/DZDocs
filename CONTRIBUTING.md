# Contributing to DayZ Modders

Thanks for helping build a knowledge base the DayZ modding community actually
deserves. **If you can write Markdown, you can contribute.** You do not need repository
access — pull requests are the path for everyone.

The full, reader-facing guidance lives on the site itself:

- **[Contributing overview](https://dayzmodders.inkihh.de/contributing/overview/)** — the model and house rules
- **[Writing docs](https://dayzmodders.inkihh.de/contributing/writing-docs/)** — how to structure a useful page
- **[Style guide](https://dayzmodders.inkihh.de/contributing/style-guide/)** — voice, tone, conventions
- **[Pull-request process](https://dayzmodders.inkihh.de/contributing/pr-process/)** — what happens after you open a PR

This file is the quick repo-level version.

## Quick start

1. **Fork** the repo (or use the **Edit** link at the bottom of any page on the site,
   which forks and opens an edit for you automatically).
2. Add or edit Markdown under `src/content/docs/<discipline>/`.
3. Open a **pull request** describing what you changed and why.

That's the whole loop. A core contributor will review it — expect friendly,
constructive feedback.

## Run it locally (optional)

Previewing locally catches broken links and formatting before review. It's not
required, but it helps.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Requires Node `>=20.3.0` (see `.nvmrc`).

## Where things live

| Path | What |
| --- | --- |
| `src/content/docs/` | All documentation pages, grouped by discipline |
| `src/content/docs/index.mdx` | The landing / hero page |
| `astro.config.mjs` | Site config and the sidebar taxonomy |
| `src/styles/theme.css` | The site theme |
| `src/assets/` | Logo, hero, and other build-processed images |
| `public/` | Static files served as-is (favicon, `_headers`) |

## Adding a page

Create a Markdown file in the right discipline directory with frontmatter:

```md
---
title: My page title
description: One line used for search and link previews.
sidebar:
  order: 2
---

Your content here.
```

The sidebar **autogenerates** from each discipline directory, so a new file shows up
in the nav automatically. Use `sidebar.order` to position it.

## House rules

- **Quality over volume.** Genuinely useful material, not filler.
- **Respect the DayZ EULA.** No de-binarization tools/workflows (e.g. DeODOL).
- **Original or vanilla assets only.** Never redistribute other people's models,
  RVMATs, or textures.
- **Be welcoming.** Build a staircase; don't pull the ladder up.
