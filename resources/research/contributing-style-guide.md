# Research — Style guide grounding

Reference material for `contributing/style-guide.md`. Unlike the tooling pages, this one is
**not** grounded in a DayZ skill — it codifies conventions already in force across the site's
own pages, so they can be applied consistently by contributors. Sources are in-repo.

## Sources (in-repo)

- **CONCEPT.md** — design principles ("quality over volume", "build a staircase, don't pull the
  ladder up", welcoming to newcomers, machine-readable output), EULA discipline.
- **`contributing/writing-docs.md`** — "lead with the point", "write for someone one step
  behind you", "show don't tell", cross-link generously, be honest about uncertainty. The style
  guide is the *conventions* companion to that page's *structure* advice — don't duplicate.
- **`implementation/content.md`** — frontmatter rules (`title` + one-line `description`,
  `sidebar.order`/`label`/`badge`), root-relative cross-linking, Starlight asides, the stub
  pattern, hazard divider.
- The **written pages themselves** (asset-work/*, scripting/*, getting-started/*) — the de-facto
  capitalization and term usage the table below just records.

## Voice & tone (distilled from CONCEPT + the pages)

- **Direct, lead-with-the-point.** Pages open by stating what they're for (see every overview).
- **Welcoming, never condescending.** The whole project is a reaction to gatekeeping; "show,
  don't talk down." Good/bad phrasing examples should contrast a warm, concrete line against a
  dismissive or hand-wavy one — *not* against incorrect information.
- **Honest about uncertainty.** writing-docs already blesses "this is what works for me; I'm not
  sure why." Capitalize on Starlight asides for hedges (the workbench page's
  ":::note[Menu wording varies]" is the model).
- **Plain, not padded.** Quality-over-volume → cut filler; one good worked example beats
  paragraphs.

## Canonical terminology table (record current site usage — don't invent new caps)

| Term | Canonical form | Notes |
| --- | --- | --- |
| P3D | **P3D** in prose, `.p3d` for the file | the model container |
| MLOD / ODOL | **MLOD**, **ODOL** (all caps) | authoring vs binarized P3D |
| LOD | **LOD** | "LODs" plural |
| RVMAT | **RVMAT** in prose, `.rvmat` for the file | the material |
| PAA | **PAA** in prose, `.paa` for the file | engine texture; suffixes `_co`, `_nohq`, `_smdi` |
| proxy / selection / memory point | lowercase | common nouns, not proper |
| PBO | **PBO** (all caps), "PBOs" plural | packed addon |
| `$PBOPREFIX$` | code style, exact casing | the prefix file |
| Enforce Script / EnScript | **Enforce Script** (formal), **EnScript** (short) | both in use; `.c` files |
| config.cpp / model.cfg | lowercase code | |
| Central Economy (CE) | **Central Economy**, **CE** | persistence subsystem |
| DayZ Tools / Workbench / Object Builder / Addon Builder / Publisher | Proper-cased | the official tools |
| `P:` drive | `P:` (code) | the work drive |
| RPT | **RPT** (logs) | |

## Capitalization & formatting conventions (observed)

- **Headings:** sentence case ("What this page covers"), not Title Case. H2s drive the "On this
  page" nav — name them so the nav reads well.
- **Code style** for: file names/paths (`config.cpp`, `P:\Mods\@MyMod`), launch params
  (`-filePatching`), config keys (`verifySignatures`), class names, code identifiers.
- **Fenced code** always carries a language tag (`cpp`, `enforce`/`c`, `text`, `gitignore`,
  `md`). The pages use ```text for trees/diagrams.
- **Bold** for first-use term emphasis and key distinctions; avoid bold as decoration.

## Cross-linking conventions (from content.md + the pages)

- **Root-relative** links only: `/asset-work/p3d-setup/`, never relative `../` or absolute URLs
  to the live domain. Trailing slash (Starlight slugs end in `/`).
- Link to anchors where useful: `/asset-work/pipeline-and-formats/#mlod-vs-odol-...`.
- Most pages end with a **## Related** list of sibling/cross-discipline pages. Scripting↔asset
  overlap is the main reason cross-linking is heavy.

## Images & assets

- Provide **alt text**; size images sensibly (don't dump full-res screenshots).
- **EULA / original-asset rule** (CONCEPT, README house rules): only **original or vanilla**
  assets in examples and screenshots; no other mods' p3d/rvmat/textures, no de-binarization
  output. This is the same rule the asset pages enforce.
