# Research — Publishing to the Steam Workshop

Reference material for `tooling-setup/publishing.md`. Learn-the-technique notes; page prose
written from scratch. Confidence flagged where it matters.

## Sources

- **BI Community Wiki** (primary): `DayZ:Modding_Basics`, `DayZ:Modding_Structure`,
  `Arma_3:_meta.cpp` (the `meta.cpp` field reference shared by the Real Virtuality lineage).
  Wiki blocks automated fetch — facts cross-checked against web-search snippets + the
  dayz-launcher knowledge base.
- **DayZ Tools (Steam)** — the **Publisher** tool (`Bin\Publisher\Publisher.exe`) is the
  official Workshop uploader.
- **Local skill `dayz-project`** — `meta.cpp` as auto-generated Workshop metadata; mod folder
  layout (`addons/`, `keys/`).

## The Publisher tool

- **Publisher** (DayZ Tools) uploads/updates Steam Workshop items. You point it at the **mod
  folder** (the `@MyMod` folder with `addons/`, `keys/`, presentation files), fill in title /
  description / tags / preview image, and it uploads. [dayz-launcher KB; Steam]
- On **first** upload Steam assigns a Workshop item ID; the Publisher records it in
  **`meta.cpp`** as **`publishedid`**. Subsequent uploads of the same folder **update** that
  item (because the id is now present). [BI; community]

## meta.cpp — the gotcha file

- `meta.cpp` holds the **Workshop metadata**: at minimum **`publishedid`** (the numeric
  Workshop item ID) and **`name`**. [BI: meta.cpp]
- **The classic failure:** a `meta.cpp` with **`publishedid = 0`** (or missing) means the mod
  isn't tied to a real Workshop item — **servers/clients reject it / players can't connect**.
  The Publisher manages this for you; the manual-pack crowd hits it by not round-tripping the
  generated `meta.cpp` back into the folder before re-uploading. Use the Publisher and let it
  own `meta.cpp`. [community: "failed to find publishedid in meta.cpp"]

## mod.cpp — presentation (optional)

- `mod.cpp` is the **in-launcher/in-game presentation** file (separate from `meta.cpp`).
  Optional but nice. Fields (from Modding Structure): **`name`**, **`picture`**, **`logo`**,
  **`logoSmall`**, **`logoOver`**, **`action`** (a URL), **`author`**, **`description`**,
  **`tooltip`**. [BI: Modding Structure]
- Distinguish clearly on the page: **`meta.cpp` = Workshop identity (publishedid)**;
  **`mod.cpp` = how the mod presents itself** (name/logo in the launcher). Different files,
  different jobs.

## Preview image & required files

- A **preview image** is required for Workshop visibility — set it in the Publisher (and/or as
  the `picture`/`logo` in `mod.cpp`). [dayz-launcher KB]
- Pre-publish checklist (KB): "check `mod.cpp`, preview image, Workshop metadata, and the final
  file list." So: packed `addons/` present, `keys/` with the public `.bikey`, `meta.cpp` +
  `mod.cpp`, preview image, and the addons actually **signed** if clients load them
  (cross-link [Packing](/tooling-setup/packing/#signing)).

## Versioning & changelog hygiene

- DayZ Workshop items have a **changelog** field per update; write what changed each push so
  server owners know whether to expect breakage. Keep a human version string (e.g. in `mod.cpp`
  description or a `CHANGELOG`). [synthesis; community best practice]
- Bumping a mod that servers run can force a client re-download mid-wipe — coordinate timing.
  [community]

## Common rejections / pitfalls (present as guidance, not gospel)

- `publishedid = 0` / missing `meta.cpp` → item not recognized. [community]
- No/oversized preview image, missing required tags, or empty `addons/`. [KB]
- Uploading **unsigned** client PBOs → loads from Workshop but gets signature-kicked on
  verifying servers. [synthesis with signing research]
- Re-uploading from a *fresh* folder (without the existing `meta.cpp`) → creates a **duplicate**
  Workshop item instead of updating. Keep and reuse the folder the Publisher knows. [community]

## Workshop vs. direct server-mod distribution

- **Client/shared mods** → Steam Workshop (players auto-download on join). **Server-only mods**
  (the `-servermod` PBOs) typically aren't on the Workshop at all — the owner drops them
  straight onto the server. Mention both so readers don't think everything must be published.
  [skill: dayz-project build types]
