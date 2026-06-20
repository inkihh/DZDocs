# Research — Packing & signing (PBOs, $PBOPREFIX$, keys)

Reference material for `tooling-setup/packing.md`. Learn-the-technique notes; the page prose
is written from scratch. The site documents the **general, tool-agnostic official workflow**
(DayZ Tools) — *not* the maintainer's private PowerShell build system. Confidence flagged
where it matters.

## Sources

- **Local skill `dayz-project`** (`/mnt/c/Users/ingma/.claude/skills/dayz-project/SKILL.md`)
  — build types (client/server/both), what gets signed, `config.cpp` (CfgPatches/CfgMods),
  packed-output layout (`packed/client` signed + key + bisign, `packed/server` unsigned).
  Authoritative for *which* PBOs need signing and why server PBOs don't.
- **Local skill `dayz-items`** — what actually ends up inside the PBO (p3d/rvmat/paa/config).
- **BI Community Wiki** (primary; `community.bistudio.com`): `PBOPREFIX`, `Addon_Builder`,
  `BinPBO_Manual`, `DayZ:Modding_Basics`, `Armed_Assault:_Addon_Signatures`. (Wiki blocks
  automated fetch — facts below cross-checked against the StarDZ DayZ Modding Wiki mirror and
  the dayz-launcher knowledge base.)
- **DayZ Tools (Steam)** — Addon Builder + the DS Utils signing tools ship in the suite.

## What a PBO is

- **P**acked **B**ank **O**bject: a flat archive holding a directory tree of one addon's
  files. **No compression** — files sit at original size; it's a container, not a zip. [StarDZ]
- One mod is one or more PBOs. A PBO's contents: a `config.cpp`/`config.bin` at the root,
  plus `scripts/`, models (`.p3d`), materials (`.rvmat`), textures (`.paa`), sounds, layouts.
- **Binarize vs pack-only.** Packing can optionally **binarize**: configs `config.cpp →
  config.bin`, models MLOD→ODOL, etc. Scripts (`.c`) are **never binarized** — they ship as
  text and compile at load. So a script-only mod can be packed "pack-only" (no binarize). [StarDZ]

## $PBOPREFIX$

- A tiny **text file at the addon source root**, named exactly `$PBOPREFIX$` (no extension).
  One line, the addon's **namespace / internal path prefix**; no trailing newline, no
  surrounding whitespace. [BI: PBOPREFIX]
- Purpose: it maps the PBO's internal tree onto the engine's **virtual filesystem**. With
  prefix `MyName\MyMod`, a file stored in the PBO at `data\foo_co.paa` is addressed engine-wide
  as `MyName\MyMod\data\foo_co.paa`. Every config/rvmat/script path string is resolved against
  that virtual path. [BI: PBOPREFIX; StarDZ]
- **Why it breaks things:** if the prefix doesn't match the paths your configs/rvmats expect,
  the engine looks in the wrong place and the file "isn't found" — grey models, missing
  textures, an addon that won't load. Must be **unique per mod** to avoid collisions in a
  multi-mod load order. [StarDZ]
- Addon Builder writes `$PBOPREFIX$` from its **`-prefix`** argument when binarizing; if you
  author the file yourself it's authoritative. [BI: Addon Builder]
- Realistic example line (ours, invented): `Acme\ExampleMod`.

## Packing with the official tools

- **Addon Builder** (DayZ Tools) is BI's official packer — GUI and command-line. You point it
  at the **source project folder** (not bare `P:` — that scans the whole drive and crawls),
  set the destination, choose binarize on/off, and optionally sign. [BI: Addon Builder]
- CLI shape (illustrative, not to be copied verbatim): `AddonBuilder.exe <src> <out> -prefix=…
  -sign=…`. `-packonly`/no-binarize for script content. [StarDZ]
- You can also drive packing from the DayZ Tools workflow around **Workbench** — present it as
  "Addon Builder, or pack from the tools you already have open"; **hedge exact UI labels**
  (they shift between tool versions, like the workbench-setup page does). [research caution]
- Community alternative: **pboProject** (Mikero tools, third-party) — widely used, but *not*
  the official path; mention only as "some modders use," don't center it. The `dayz-project`
  skill's own build uses pboproject, but that's the private system we explicitly don't document.

## Signing — keys

- **Key pair** via DS Utils' **DSCreateKey** (`DSCreateKey MyKey`): produces
  - `MyKey.biprivatekey` — **private**, secret, author-only, used to sign. Never distribute.
  - `MyKey.bikey` — **public**, distributed; goes in a server's `keys/` folder.
  [BI: Addon Signatures; dayz-launcher KB]
- **Signing** a PBO with **DSSignFile** (or Addon Builder's `-sign`) uses the private key to
  emit a **`.bisign`** sitting next to the PBO (e.g. `MyMod.pbo.MyKey.bisign`). The `.bisign`
  ships with the mod; the `.bikey` is what the server holds. [StarDZ; dayz-launcher KB]
- Tools location: `Bin\DsUtils\` in the DayZ Tools install — `DSCreateKey.exe`,
  `DSSignFile.exe`, `DSCheckSignatures.exe`, and a `DSUtils.exe` GUI. [dayz-launcher KB]
- **Verification:** server `serverDZ.cfg` `verifySignatures = 2;` makes the server check that
  each client PBO has a `.bisign` matching a `.bikey` in its `keys/` folder. Mismatch/missing →
  signature kick. [BI; community]

## When signing is / isn't required — the key distinction

- **Client (signature-checked) mods must be signed.** A mod players load via `-mod=` on a
  server running `verifySignatures` needs a valid `.bisign` + the server holding the `.bikey`.
  This is the normal case for any client-side or shared mod. [skill: dayz-project; BI]
- **Server-only mods don't need signing.** Loaded via `-servermod=`, they run only on the
  server, never travel to clients, and aren't signature-checked — the `dayz-project` skill
  packs `packed/server/` **unsigned** on purpose. [skill: dayz-project]
- So the rule on the page: *sign anything clients download; server-only addons can stay
  unsigned.* Local single-player testing doesn't require signing either, but signing during
  dev catches key/packaging issues early. [StarDZ]

## Verifying a packed mod loads

- Launch DayZ with `-mod=@YourMod` (and `-servermod=` for server PBOs); a mod that loads shows
  in the in-game mod list / loads its content. RPT log is the first stop if it doesn't. [skill]
- Classic failure surfaced here: **mixed-case** packed files break on Linux servers (workbench
  page already says this) → keep `addons/` + files **lowercase**. [BI]
- A wrong/missing `$PBOPREFIX$` shows up exactly as the "works unpacked, fails packed" symptom
  cross-linked to [File patching](/tooling-setup/file-patching/). [synthesis]
