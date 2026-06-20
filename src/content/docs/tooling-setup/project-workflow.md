---
title: Project workflow
description: Directory layout, source control, and keeping a mod project maintainable.
sidebar:
  order: 5
---

The difference between a mod you can still work on a year from now and one you dread opening is
mostly **structure**: a directory layout that maps cleanly to addons, a clear line between
source and build output, and source control that keeps the things you can't regenerate. None of
it is DayZ-specific magic — it's ordinary project hygiene applied to the way DayZ packs. This
page lays out a layout, what to commit, and how to make the build repeatable.

It builds on the `P:` drive and source/output split from
[Workbench setup](/getting-started/workbench-setup/) — read that first if you haven't.

## A layout that maps to addons

Two rules carry most of the weight:

1. **One addon = one folder.** Each source folder that becomes a [PBO](/tooling-setup/packing/)
   maps 1:1 to an addon, carries its own `$PBOPREFIX$`, and its subfolders become the PBO's
   internal tree. A clean source tree gives you predictable packed paths.
2. **Source is not build output.** What you *edit* (configs, scripts, models, textures) lives in
   one tree; the packed `@Mod/` with `addons/*.pbo` and `keys/` is **generated** and lives
   somewhere else. Never edit inside the packed folder — it's disposable.

A workable layout for a single-addon mod:

```text
my-mod/                      # source repo (version controlled)
├─ src/
│  └─ acme_examplemod/       # one addon = one folder
│     ├─ $PBOPREFIX$         # Acme\ExampleMod
│     ├─ config.cpp
│     ├─ scripts/
│     │  └─ 4_World/...       # script modules — see Game structure
│     └─ data/                # textures, rvmat, models
├─ keys/                     # public .bikey only — never the .biprivatekey
├─ mod.cpp                   # launcher presentation
├─ .gitignore
└─ build/                    # generated PBOs / output — git-ignored
```

The `scripts/4_World/...` nesting follows the engine's script-module layers — see
[Game structure](/scripting/game-structure/).

### Splitting into addons

When a mod has **server-only** logic, split it into its own addon: a shared/client PBO plus a
server PBO. The server PBO declares the client one in its `requiredAddons[]` so load order is
guaranteed, the client PBO gets [signed](/tooling-setup/packing/#signing) and the server PBO
doesn't. In the layout above that's just a second folder under `src/` with its own
`$PBOPREFIX$`. Keep the split at the folder level and the packed output follows naturally.

## Source control with Git

Git fits a mod project well — but only commit what you can't regenerate, and never commit
secrets.

**Commit (the source you author):**

- `config.cpp`, `model.cfg`, and your `.c` scripts
- `$PBOPREFIX$`
- **MLOD `.p3d` models and layered texture sources** (`.psd`/`.tif`) — there's no supported way
  to recover these from a shipped PBO, so they *must* live in source control
- `.rvmat` materials
- `mod.cpp`, and the **public `.bikey`**
- docs and the build script

**Ignore (generated or secret):**

- Packed `*.pbo` and `*.bisign`, and the whole `build/` / `@Mod/` output — all rebuilt from source
- Runtime artifacts: `*.RPT` logs, crash dumps, profile folders
- **`*.biprivatekey`** — the private signing key. Committing it hands anyone your signing
  identity. This is a hard rule.

```ini
# Build output
build/
*.pbo
*.bisign

# Secrets — never commit the private signing key
*.biprivatekey

# Runtime logs / profiles
*.RPT
*.log
crash_*.log
```

:::caution[The private key is the one that must never leak]
Everything else in the ignore list is just clutter or rebuildable. The `.biprivatekey` is
different — anyone who has it can sign mods as you. Keep it out of the repo (and ideally backed
up separately), and only ever distribute the matching `.bikey`.
:::

:::note[`meta.cpp` is a judgement call]
Its `publishedid` ties the folder to your Workshop item (see
[Publishing](/tooling-setup/publishing/#metacpp-the-one-that-bites)). It's generated, but
losing it means re-uploads create a *duplicate* item — so many people keep it (or at least
record the id somewhere) rather than ignoring it outright.
:::

## Separating source from build output, and scripting the build

The pack step reads **source** and writes to a **separate** output folder, which makes a clean
rebuild trivially "delete output, repack." Lean on that separation:

### Scripting the build

[Addon Builder](/tooling-setup/packing/#packing-with-the-official-tools) runs from the command
line, so the whole pack-and-sign sequence can collapse into **one command** — a small `.bat` or
PowerShell script, or the parallel "mod project handler" app. The payoff is repeatability:
anyone (including future you) can rebuild the exact same PBO without remembering a sequence of
GUI clicks.

During day-to-day development you rarely run the full build at all — [file patching](/tooling-setup/file-patching/)
lets you iterate on scripts loose, and you only pack when you need a real artifact to test or
publish.

## Maintainability for "future you"

The point of all of this is recoverability. A consistent layout, source under version control,
and a one-command build mean the project can be picked up months later — or handed to someone
else — without archaeology. The most important habit is the one the EULA forces anyway: **keep
your editable sources** (MLOD models, layered textures), because a shipped ODOL PBO is a dead
end you can't legally or technically reverse.

## Related

- [Workbench setup](/getting-started/workbench-setup/) — the `P:` drive and source/output split this builds on.
- [Packing](/tooling-setup/packing/) — turning this layout into PBOs.
- [Publishing](/tooling-setup/publishing/) — where the metadata files and keys end up.
- [File patching](/tooling-setup/file-patching/) — the fast loop you'll use between builds.
