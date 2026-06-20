---
title: Style guide
description: Voice, tone, terminology, and conventions for pages on this site.
sidebar:
  order: 3
---

This page is the **conventions** companion to [Writing docs](/contributing/writing-docs/):
that page is about *structuring* a page; this one is about the small consistent choices —
voice, the names we give things, capitalization, links — that make the whole site read like it
was written by one careful hand. None of it is hard. When in doubt, match the pages already
written.

## Voice and tone

The whole project exists as a reaction to a gatekeeping culture, so the writing models the
opposite: **direct, welcoming, and never condescending.**

- **Lead with the point.** Say what a page or section is for in the first line or two. Don't
  bury it under preamble.
- **Write for someone one step behind you.** Assume the reader is capable but new to *this*
  topic. Define jargon the first time it appears.
- **Be warm, not clever at the reader's expense.** No "obviously," no "just do X," no sighing
  at a beginner question.
- **Be honest about uncertainty.** "This is what works for me; I'm not sure why" is more useful
  than confident hand-waving. Put hedges in a `:::note`.

Concrete contrasts:

| Instead of… | Write… |
| --- | --- |
| "Obviously you just binarize it and it works." | "Binarizing compiles your config and models into the runtime forms the engine loads — here's what that step does." |
| "If you don't know what a PBO is, read literally anything first." | "A PBO is the packed archive the game loads your mod from — see [Packing](/tooling-setup/packing/)." |
| "It's trivial." / "Simply set the prefix." | "Set the `$PBOPREFIX$` to your addon's namespace; here's why it matters and how it breaks." |

The bad examples aren't *wrong information* — they're dismissive. The fix is tone, not facts.

## Terminology

Use the canonical form so pages stay consistent and **searchable**. These are the spellings and
casings the existing pages already use:

| Concept | Canonical form | Notes |
| --- | --- | --- |
| The 3D model | **P3D** (prose), `.p3d` (file) | the model container |
| Authoring vs runtime model | **MLOD** / **ODOL** | both all-caps; editable vs binarized |
| Level of detail | **LOD**, "LODs" | |
| Material | **RVMAT** (prose), `.rvmat` (file) | |
| Texture | **PAA** (prose), `.paa` (file) | map suffixes `_co`, `_nohq`, `_smdi` |
| Packed addon | **PBO**, "PBOs" | all caps |
| The prefix file | `$PBOPREFIX$` | code style, exact casing |
| Scripting language | **Enforce Script** (formal), **EnScript** (short) | `.c` files |
| Persistence system | **Central Economy** / **CE** | |
| The tools | **DayZ Tools**, **Workbench**, **Object Builder**, **Addon Builder**, **Publisher** | proper-cased |
| The work drive | `P:` | code style |
| Common nouns | proxy, selection, memory point | lowercase — they're not proper nouns |

If you introduce a term the site doesn't have yet, define it on first use and add it here in the
same PR.

## Capitalization and formatting

- **Headings are sentence case** — "What this page covers," not "What This Page Covers." H2
  headings build the right-hand "On this page" nav, so name them so that nav reads well on its
  own.
- **Use `code` style** for file names and paths (`config.cpp`, `P:\Mods\@MyMod`), launch
  parameters (`-filePatching`), config keys (`verifySignatures`), class names, and any code
  identifier.
- **Fenced code blocks always get a language tag** for highlighting — `cpp`, `c`, `text`,
  `gitignore`, `md`. Use ` ```text ` for directory trees and diagrams.
- **Bold** marks a term's first use or a key distinction. Don't bold for decoration.
- **Asides** (`:::note`, `:::tip`, `:::caution`, `:::danger`) carry callouts and hedges — see
  [Writing docs](/contributing/writing-docs/#practical-formatting). A `:::caution` is the right
  home for "this is the thing that silently breaks."

## Cross-linking

Scripting and asset work overlap heavily, so we **link instead of re-explaining**.

- **Root-relative links only:** `/asset-work/p3d-setup/`, never a relative `../path` and never a
  full `https://dzdocs.inkihh.de/...` URL for an internal page. Slugs end in a trailing
  slash.
- **Link to anchors** when you mean a specific section:
  `/tooling-setup/packing/#signing`.
- **End a page with a `## Related` list** of sibling and cross-discipline pages — most pages do.
- Link a concept on its **first meaningful mention** rather than every time it appears.

## Images and assets

- **Always provide alt text**, and size images sensibly — don't drop a full-resolution
  screenshot where a cropped one makes the point.
- **Original or vanilla assets only.** Screenshots and example assets may use **your own
  original work or vanilla DayZ content** — never another mod's models, materials, or textures,
  and never anything produced by de-binarization. This is the same EULA rule the asset pages and
  the [house rules](/contributing/overview/#house-rules) enforce, and it applies to imagery too.

## Related

- [Writing docs](/contributing/writing-docs/) — how to structure a page that's actually useful.
- [Pull-request process](/contributing/pr-process/) — what happens after you open a PR.
- [Contributing overview](/contributing/overview/) — the house rules these conventions serve.
