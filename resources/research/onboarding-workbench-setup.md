# Research — Workbench / DayZ Tools setup

Reference material for `getting-started/workbench-setup.md`. Learn-the-technique notes;
prose on the site is written from scratch. Confidence is flagged where it matters.

## Sources

- **Local skill `dayz-project`** (`/mnt/c/Users/ingma/.claude/skills/dayz-project/SKILL.md`)
  — the maintainer's own build system: P: drive, symlinks, PBO packing/signing, build
  types, profiles/RPT logs. Authoritative for how the workflow actually runs day to day.
- **Local skill `dayz-dev-plugin`** — `systems/mod-structure.md` for the on-disk layout.
- **BI Community Wiki** (primary; `community.bistudio.com`, mirror `community.bohemia.net`):
  `DayZ:Modding_Basics`, `Work_Drive`, `DayZ:Buldozer_for_Object_Builder`,
  `Addon_Builder`, `DayZ:Workbench_Script_Debugging`, `DayZ:Tools_Launcher`.
- **DayZ Tools on Steam** (official): https://store.steampowered.com/app/830640/DayZ_Tools/

## Installing DayZ Tools

- Free Bohemia-published suite (released 2018-11-07). Found in Steam under **Library →
  Tools** (software, not games). Windows-only; 64-bit. [Steam]
- Bundles: **Workbench**, **Object Builder**, **Addon Builder**, **Publisher**, **Terrain
  Builder**, **Central Economy Editor** (+ Buldozer as Object Builder's in-engine viewer).
  [Steam]
- Prerequisites: own the Steam version of DayZ, and **launch the game once** before opening
  the tools — otherwise Workbench aborts with a "game is not installed" error. [BI: Modding
  Basics / Workbench Script Debugging]
- Launching "Play DayZ Tools" opens the **DayZ Tools Launcher**, which validates the install
  and runs the individual tools. [BI: Tools Launcher]

### Tool roles (toolchain map)

- **Workbench** — all-in-one Enfusion tool for the *code/runtime* side: scripting (Script
  Editor + live debugging against `DayZDiag_x64.exe`), particles, UI. [Steam, BI]
- **Object Builder** — the 3D model/asset tool (P3D: LODs, named selections, memory points,
  proxies, materials). Previews via **Buldozer**. [Steam, BI: Buldozer]
- **Addon Builder** — the packer: binarizes content and packs a source folder into a `.pbo`.
  Can sign. [BI: Addon Builder]. Community alternative: **pboProject / pboproject** (what the
  `dayz-project` build system actually uses). [skill: dayz-project]
- **Publisher** — uploads finished mods to the Steam Workshop. **DS Utils** generates the
  `.bikey` / `.biprivatekey` signing keys. [BI: Modding Basics, Steam]

## The P: drive (work / project drive)

- A **virtual drive, conventionally `P:`**, holding a representation of the DayZ filesystem
  plus your mod source. Managed by `WorkDrive.exe`. Tools resolve content by absolute paths
  rooted at `P:\`, so mod source must live under P:. [BI: Work Drive; skill: dayz-project]
- Two distinct operations (don't conflate):
  1. **Mount the drive** — configured via DayZ Tools Launcher → Settings (path + letter,
     default `P:\`); can mount at startup. Makes `P:` appear in Explorer. [BI: Buldozer]
  2. **Extract Game Data** — DayZ Tools Launcher → Tools → Extract Game Data — populates P:
     with the vanilla game files for reference/compilation. [BI: Modding Basics, Buldozer]
- Use `P:` specifically: sample projects and default texture paths are hard-rooted at `P:\`;
  another letter breaks them. The Settings dialog technically allows another letter. [BI]
- The `dayz-project` build system creates **symlinks on P:** pointing at the real source
  directories (e.g. `P:\RestartWarner` → source folder), and pboProject reads from P: to
  pack. This is the advanced/iteration-friendly variant of "mod source lives on P:". [skill]

## Extracting vanilla game data — and the EULA line

- Official **Extract Game Data is the legitimate path** — it's Bohemia's own tool providing
  the data for modding. **Re-extract after every major game update** so references match the
  current game. [BI: Modding Basics, Buldozer]
- The DayZ EULA forbids the *other* direction: reverse-engineering / de-binarizing shipped
  binarized assets (DeODOL). That's the house rule already in CONCEPT/README — official
  extract = fine; de-binarization = not allowed. [BI EULA]
- Confirmed extracted folder: a top-level **`P:\scripts`** (used in symlink examples). The
  vanilla data root is referenced as **`DZ`** and the core addon as **`DZ_Data`** (the usual
  `requiredAddons[]` entry). The exact full top-level layout (`dz`/`DZ` root) is widely
  reported but I did not pin every folder to a primary page → honest-uncertainty candidate.
  [BI: Workbench Script Debugging, Modding Structure; skill: mod-structure]

## Project drive layout

- Mod source lives under the work drive, e.g. `P:\YourMod\`, with script-module subfolders
  like `P:\YourMod\scripts\4_World\`. [BI: Modding Basics]
- Packed output goes to a **separate** tree, conventionally `P:\Mods\@YourMod\addons\` —
  note the `@` prefix and **lowercase** `addons` + packed files (required for Linux server
  compatibility). [BI: Modding Basics]
- A mod folder typically holds `addons/` (PBOs), `keys/` (`.bikey`), `meta.cpp` (Workshop
  metadata, auto-generated), `mod.cpp` (presentation). [BI: Modding Structure; skill]
- Addon Builder: set "path to project folder" to the mod's project folder, **not** bare `P:`
  (bare `P:` makes it scan the whole drive — very slow). [BI: Addon Builder]
- `$CurrentDir$` is Arma/BinPBO-era terminology; DayZ uses "path to project folder" /
  `-project`. Don't assert `$CurrentDir$` for DayZ. [research flag]

## First-run sanity checks

- `P:` visible in Explorer after launching Tools / mounting.
- Game data present on P: (e.g. `P:\scripts` populated). Extraction can take ~20 min on HDD.
- Workbench opens without the "game is not installed" error (proves DayZ ran once).
- Workbench Resource Browser shows the project tree after **Options → Workbench → Source
  data directory = `P:\`** + restart. [BI: Workbench Script Debugging]
- Object Builder can launch Buldozer (asset-side check) once External viewer path is set. [BI]

## Common mistakes & recovery (primary unless flagged [community])

- **DayZ never launched** → "game is not installed" error → launch the game once. [BI]
- **Source data directory not `P:`** → empty Resource Browser → set it + restart. [BI]
- **Addon Builder project folder too broad (`P:`)** → packing scans whole drive → set to the
  mod folder. [BI]
- **Uppercase in packed addon** → breaks on Linux servers → keep `addons`/files lowercase. [BI]
- **Stale extracted data after update** → re-run Extract Game Data. [BI]
- **Drive not re-mounted after reboot** → P: missing until Tools reopened; use mount-at-startup.
  [community / unverified-primary]
- **Path with spaces / wrong drive letter / too little free space (~20 GB guideline)** →
  common community folklore, present as guidelines not gospel. [community]
- **RPT files are the first debugging stop** when something runs but misbehaves: client/server
  `*.RPT` in the profile directory hold script errors and warnings. [skill: dayz-project]
