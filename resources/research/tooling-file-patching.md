# Research — File patching

Reference material for `tooling-setup/file-patching.md`. Learn-the-technique notes; page prose
written from scratch. Confidence flagged where it matters.

## Sources

- **BI Community Wiki** (primary): `DayZ:Modding_Basics` (the canonical file-patching walkthrough),
  `DayZ:Server_Configuration` (`allowFilePatching`). Wiki blocks automated fetch — facts below
  cross-checked against web search snippets of those pages and community server configs.
- **Local skill `dayz-project`** — RPT logs as the debugging surface; what's binarized at pack
  time (so what *can't* be patched).
- **Local skill `dayz-dev-plugin`** — scripts ship as text and compile at load (why scripts are
  patchable). Cross-links to scripting.

## What file patching is

- A dev mode where the engine reads a mod's files **loose from disk** instead of from the
  packed PBO. Edit a script, reload, see the change — **no repack**. This is the single
  biggest iteration-speed win in DayZ scripting. [BI: Modding Basics]
- Mechanism: the loose-file mod folder is loaded via **`-mod=`** like any mod, but with
  **`-filePatching`** the engine prefers the loose file on disk over the same path inside a
  PBO. [BI]

## Launch / server setup

- **Client launch parameter:** `-filePatching`. Used with `-mod=<path to loose mod folder>`.
  Dev typically uses **`DayZDiag_x64.exe`** (the diagnostic client from DayZ Tools) for the
  tightest loop. [BI: Modding Basics]
- **Server opt-in:** `serverDZ.cfg` → **`allowFilePatching = 1;`** — when 1, the server lets
  clients that have `-filePatching` enabled connect. Default/`0` blocks them. [BI: Server
  Configuration; community serverDZ.cfg]
- **Workbench runtime recompile:** in Workbench you can recompile scripts during a running
  session (**Ctrl+F7**) so changes take effect without a full restart. [BI: Modding Basics]
- Example invocation (illustrative): `DayZDiag_x64.exe "-mod=P:\Mods\@MyMod" -filePatching
  -connect=127.0.0.1 -port=2302`. [community]

## What can and can't be patched

- **Can:** plain-text files the engine reads at load — **scripts (`.c`)** and **text configs
  (`config.cpp`)**. These are exactly the files that are *not* binarized. [dayz-dev-plugin; BI]
- **Can't:** **binarized assets** — models (ODOL `.p3d`), `.paa` textures, binarized
  `config.bin`. Those must be rebuilt/repacked; file patching doesn't help. [dayz-items; BI]
- Practical line for the page: file patching is a **scripting/config** iteration tool; asset
  iteration still goes through the modeling tools + repack.

## "Works patched, breaks packed" — failure modes

The whole hazard of file patching: loose files are more forgiving than a packed PBO, so bugs
hide until you pack. Document these:

- **Path case.** Loose files on Windows are case-insensitive; a binarized PBO on a **Linux
  server** is not. A reference to `Data/Foo.paa` that's really `data/foo.paa` works patched,
  fails packed-on-Linux. [BI; synthesis with workbench-setup lowercase rule]
- **Missing/wrong `$PBOPREFIX$`.** Loose loading uses the on-disk folder path; packed loading
  uses the prefix. If the prefix is absent or wrong, paths that resolved loose break once
  packed. [BI: PBOPREFIX; synthesis] → cross-link [Packing](/tooling-setup/packing/).
- **Binarization-only errors.** Some mistakes only surface when the binarizer runs (a model or
  config that the binarize step rejects/transforms). Patched, the binarizer never ran, so the
  error never appeared. [dayz-items; synthesis]
- **Files not actually included in the pack.** A file you edited loose but Addon Builder's
  include rules skip → present patched, absent packed. [synthesis]

## Discipline

- Always do a **final packed, no-filePatching test** before publishing — repack and verify the
  mod with `-filePatching` *off*, ideally against a Linux-style case-sensitive check. [BI]
- RPT log is the first stop when packed behaviour diverges from patched. [skill: dayz-project]
