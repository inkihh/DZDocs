# Research — Project workflow (layout, source control, build)

Reference material for `tooling-setup/project-workflow.md`. Learn-the-technique notes; page
prose written from scratch. The site documents a **general, tool-agnostic** layout — *not* the
maintainer's private `_DayZBuild` PowerShell system, which is only mined for principles.

## Sources

- **Local skill `dayz-project`** — the maintainer's own structure: source in a **separate git
  repo** from build output; `src/` is a symlink; `packed/` (PBOs/keys/bisign) and `build/`
  (profiles, logs) are generated, not committed; P: symlinks point at source. The *principles*
  (separate source from build output; keep source under version control; generated artifacts
  are disposable) generalize even though the specific scripts don't.
- **BI Community Wiki**: `DayZ:Modding_Structure` (mod folder shape: `addons/`, `keys/`,
  `meta.cpp`, `mod.cpp`), `DayZ:Modding_Basics` (P: source vs `@Mod` packed output).
- Site's own [Workbench setup](/getting-started/workbench-setup/) — already establishes "keep
  source separate from packed output" and the `P:\MyMod` + `P:\Mods\@MyMod\addons` split.

## Directory layout principles

- **Source folder ≠ packed mod folder.** Editable source (`config.cpp`, `scripts/`, `.p3d`,
  layered textures, `.rvmat`, `$PBOPREFIX$`) lives in one tree; the packed `@MyMod/` with
  `addons/*.pbo` + `keys/` is **build output** somewhere else. The workbench page already draws
  this line (`P:\MyMod` source vs `P:\Mods\@MyMod\addons` output). [BI; site]
- **Folder = addon.** Each source folder that becomes a PBO maps 1:1 to an addon, carries its
  own `$PBOPREFIX$`, and its internal subfolders (`scripts/4_World/…`, `data/`, `models/`)
  become the PBO's tree. A clean source tree → predictable packed paths. [BI; packing research]
- **Script-module folders** inside a scripting PBO follow the load layers (`3_Game`, `4_World`,
  `5_Mission`) — see [Game structure](/scripting/game-structure/). [dayz-dev-plugin]
- **Client/server split** (from `dayz-project` build types): a "both" mod is two source folders
  → two PBOs (shared/client + server-only), the server PBO `requiredAddons` the client one for
  load order. Generalize as "split server-only code into its own addon." [skill]

### Sample layout to put on the page (ours, invented)

```text
my-mod/                      # source repo (version controlled)
├─ src/
│  └─ MyName_MyMod/          # one addon = one folder
│     ├─ $PBOPREFIX$         # MyName\MyMod
│     ├─ config.cpp
│     ├─ scripts/4_World/...
│     └─ data/               # textures, rvmat, models
├─ keys/                     # public .bikey only (NOT the .biprivatekey)
├─ mod.cpp                   # presentation
├─ .gitignore
└─ build/                    # generated PBOs/output — ignored
```

## Source control (Git)

- **Commit (source):** everything you hand-author — `config.cpp`, `*.c` scripts, `*.rvmat`,
  `model.cfg`, `$PBOPREFIX$`, **MLOD `.p3d`** and layered texture sources, `mod.cpp`, the
  **public `.bikey`**, docs. These are the things you can't regenerate. [synthesis; pipeline
  research "back up your MLOD sources"]
- **Ignore (generated/secret):**
  - Packed **`*.pbo`** and **`*.bisign`** — rebuilt from source.
  - **`build/` / `packed/` output**, `@Mod/` packed folders.
  - **`meta.cpp`** is borderline: it carries the Workshop `publishedid` (worth keeping
    somewhere so re-uploads update the same item) — note the trade-off rather than a hard rule.
  - **Profiles / RPT logs / crash dumps** (`*.RPT`, `crash_*.log`, `build/profile/...`). [skill]
  - **`*.biprivatekey`** — **never commit the private signing key.** Hard rule, call it out
    loudly. [signing research]
- This mirrors the `dayz-project` split: source in its own repo, `packed/` + `build/` generated
  and disposable. [skill]

### Sample `.gitignore` (ours, invented)

```gitignore
# Build output
build/
packed/
*.pbo
*.bisign

# Secrets — never commit the private signing key
*.biprivatekey

# Runtime logs / profiles
*.RPT
*.log
crash_*.log
```

## Separating source from build output & scripting the build

- The pack step (Addon Builder, see [Packing](/tooling-setup/packing/)) should read **source**
  and write to a **separate** output folder, so a clean rebuild is `delete output → repack`.
  Never edit inside the packed folder. [BI; site]
- **Scripting the build** (Addon Builder CLI, a `.bat`/PowerShell, or the parallel "mod project
  handler" app) makes packing **one command** and repeatable — the principle behind the
  maintainer's `build.ps1`, generalized. Don't document the private script itself. [skill]
- During dev, lean on [File patching](/tooling-setup/file-patching/) so you only run the full
  build when you actually need a packed artifact.

## Maintainability for "future you"

- A consistent layout + committed source + a one-command build means a project is recoverable
  and handover-able months later. Tie back to the EULA-driven reason MLOD/layered-texture
  sources must be kept: there's **no supported way to recover them** from a shipped ODOL PBO.
  [pipeline research; EULA]
- Cross-links: [Workbench setup](/getting-started/workbench-setup/) (the P: layout this builds
  on), [Packing](/tooling-setup/packing/), [Publishing](/tooling-setup/publishing/).
