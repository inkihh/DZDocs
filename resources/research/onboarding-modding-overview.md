# Research — Modding overview (bird's-eye)

Reference material for `getting-started/modding-overview.md`. High-level/structural;
learn-the-technique notes. Site prose written from scratch.

## Sources

- **Local skill `dayz-dev-plugin`** (`/mnt/c/Users/ingma/.claude/skills/dayz-dev-plugin/`):
  `systems/mod-structure.md`, `scripting/enforce-script.md`, `scripting/memory-management.md`,
  `systems/server-client-split.md`. Authoritative, DayZ 1.28+.
- **Local skill `dayz-items`**: `pipeline/architecture.md`, `file-formats/FORMATS.md` — the
  asset/item pipeline and file formats (P3D MLOD/ODOL, RVMAT, PAA, model.cfg, config.cpp).
- **BI Community Wiki** (primary): `DayZ:Modding_Basics`, `DayZ:Modding_Structure`,
  `DayZ:Enforce_Script_Syntax`, `config.cpp`, `RVMAT_basics`, `P3D File Format - ODOLV4x`.

## The two halves — scripting vs. asset work

- **Scripting = Enforce Script (EnScript)**: Bohemia's statically-typed, C-like, OO language
  (closer to C# than C++/Lua), introduced with DayZ Standalone, running on the **Enfusion**
  engine. Classes, inheritance via `extends`, templates, GC with `ref`/`autoptr` reference
  counting. Carries gameplay logic. [skill: enforce-script; BI: Enforce Script Syntax]
- **Asset work = models + configs + materials + textures**:
  - `.p3d` model (MLOD = editable source, ODOL = binarized) — LODs, named selections, memory
    points, proxies. [dayz-items: FORMATS]
  - `.rvmat` material — how a surface responds to light; references texture maps; assigned
    per-face. [BI: RVMAT basics]
  - `.paa` texture — runtime format compiled from source (TGA/PNG). Suffix conventions matter:
    `_co` color/diffuse, `_nohq` normal, `_smdi` specular, `_as` ambient shadow. Wrong suffix
    silently breaks conversion. [dayz-items; BI: RVMAT basics; skill: mod-structure uses
    `_co`/`_nohq`]
  - `config.cpp` — the connective tissue (see below).
- **Why they overlap:** one in-game item is never one file. A weapon/vehicle/item = P3D +
  RVMAT(s) + PAA textures + a config class (+ optional script), all cross-referencing each
  other by name (e.g. `hiddenSelections[]` in config must match named selections in the P3D;
  `model = "\Mod\data\x.p3d"`). This is exactly why the site cross-links Scripting ↔ Asset
  Work. [dayz-items: architecture; skill: mod-structure CfgVehicles example]

## The shape of a mod on disk

- Mod folder `@MyMod/`: `mod.cpp` (metadata), `meta.cpp` (Workshop, auto-gen), `Keys/*.bikey`,
  `Addons/` (PBOs), and inside each addon source: `config.cpp`, `$PREFIX$`, `data/` (p3d, paa),
  `scripts/` (modules). [skill: mod-structure]
- **PBO** = "Packed Bohemia Object" — packed addon archive. A folder with a `config.cpp`
  containing a **CfgPatches** class *is* an addon. Game loads PBOs from `addons/`. PBOs and the
  `addons` folder must be lowercase for Linux servers. [BI: Modding Basics, config.cpp]
- **config.cpp vs config.bin** — text source vs binarized; if both exist, `.bin` wins. [BI]
- **CfgPatches** declares the addon + `requiredAddons[]` (drives load order, e.g. `"DZ_Data"`).
  **CfgMods** registers the mod's **script module directories** and which modules they extend.
  The engine discovers a mod's classes/scripts through the config. [BI; skill: mod-structure]
- **Script modules** (numbered folders, compile in order):
  `1_Core` → `2_GameLib` → `3_Game` → `4_World` → `5_Mission`.
  Access rule: a lower module can't see higher ones (3_Game can't access 4_World/5_Mission;
  5_Mission sees all). Mod scripts are **merged into** the matching vanilla module, not
  replaced. [skill: mod-structure — has the access-rule table]
  - Note: module 2 spelling `2_GameLib` (engine name `gamelibScriptModule`) — a search summary
    once rendered it `2_GameScript`; treat `2_GameLib` as correct but a worked config example
    is the final word. The three most-used in practice are 3_Game / 4_World / 5_Mission. [flag]

## Where the game ends and your mod begins

- Vanilla content lives in DayZ's base addons; data root `DZ`, core addon `DZ_Data`. [BI; skill]
- Mods **extend, don't replace**:
  - `modded class` — extends an existing class without editing the original; `override` the
    methods you change, always `super.` Add **no** `: Parent` to a modded class (it already
    inherits; adding it is silently ignored). Prefix custom members with the mod name. [skill:
    enforce-script, server-client-split]
  - Config inheritance — mod config classes inherit from vanilla and override only what's needed.
  - Load order via `requiredAddons[]` — an addon loads after everything it requires, so the
    classes it extends already exist. [BI; skill]
- `@ModName` folder convention; game loads with `-mod=` (multiple mods semicolon-delimited);
  server-only PBOs via `-servermod` (unsigned, never shipped to clients). [BI; skill:
  server-client-split]

## Toolchain at a glance

- DayZ Tools suite (Workbench = code/runtime; Object Builder = models; Addon Builder = pack;
  Publisher = Workshop) + the **P: drive**. Setup covered in depth on the Workbench page; don't
  duplicate. [Steam; see onboarding-workbench-setup.md]

## Learning curve / where people get stuck

- **Setup first wall:** P: drive mount + Extract Game Data is the first thing newcomers
  misconfigure (the flagged "common early pitfall"). [BI; task brief]
- **Docs are scattered and assume Arma knowledge** — precisely the gap this site fills. [BI;
  community]
- **Asset/P3D pipeline** (most-cited hard part): LOD order/types, named selections driving
  everything, `hiddenSelections[]` mismatch vs config, missing FireGeometry / broken proxies,
  RVMAT + texture-suffix gotchas. [dayz-items; BI: P3D/RVMAT]
- **EnScript gotchas:** reference counting — `ref`/`autoptr` are **member-only** (never in
  params/returns/locals); aggressive GC collects unreferenced objects between frames; class
  must extend `Managed` for `ref` to do anything; never `delete` (null instead); circular
  `ref` leaks. Client/server split: a signed client PBO is fully unpackable, so anything secret
  must live server-side. [skill: memory-management, server-client-split, enscript]
- One-line spine for the page: **source on `P:` → declared by config.cpp (CfgPatches +
  CfgMods) → binarized & packed by Addon Builder into `.pbo` → placed in `@ModName/addons/` →
  signed with `.bikey` → loaded via `-mod=` or the Workshop.**
