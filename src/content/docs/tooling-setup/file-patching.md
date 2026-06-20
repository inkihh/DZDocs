---
title: File patching
description: Iterating on scripts without repacking your whole mod every change.
sidebar:
  order: 3
---

Repacking a mod every time you change a line of script is slow enough to kill momentum.
**File patching** is the development mode that fixes that: the engine reads your mod's files
**loose from disk** instead of from the packed PBO, so you edit a script, reload, and see the
change — no repack. It's the single biggest iteration-speed win in DayZ scripting, and it's the
normal way to work while developing.

It comes with one catch worth knowing up front: loose files are more forgiving than a packed
PBO, so some bugs stay hidden until you pack. The [last section](#works-patched-breaks-packed)
covers those.

## What it does

Normally the engine loads a mod's content from inside its [PBO](/tooling-setup/packing/). With
file patching on, the engine **prefers the loose file on disk** over the same path inside a
PBO. You point the game at a folder of unpacked source, flip a switch, and your edits take
effect on the next reload instead of after a full pack-and-restart cycle.

This is a **scripting and config** workflow. It's how you iterate on EnScript without paying the
pack cost on every change — pair it with the [Scripting](/scripting/overview/) section.

## Launch and server setup

Three pieces have to line up — a launch parameter, a loose-file mod folder, and the server's
permission:

- **`-filePatching`** — the client launch parameter that turns the feature on. Most developers
  use **`DayZDiag_x64.exe`** (the diagnostic client that ships with DayZ Tools) for the
  tightest loop.
- **`-mod=`** pointing at your **loose** mod folder — the unpacked source, not a packed
  `@Mod`. This is the folder whose files the engine reads directly.
- **`allowFilePatching = 1;`** in the server's `serverDZ.cfg` — the server must opt in, or it
  refuses clients that have `-filePatching` enabled. (A local dev server you control; public
  servers leave this off.)

A typical local invocation looks like:

```text
DayZDiag_x64.exe "-mod=P:\Mods\@ExampleMod" -filePatching -connect=127.0.0.1 -port=2302
```

:::tip[Recompile without restarting]
Inside **Workbench** you can recompile scripts during a *running* session (**Ctrl + F7**), so
many changes take effect without even relaunching the game. That, plus file patching, is the
fast inner loop.
:::

## What can and can't be patched

File patching only helps with files the engine reads as **text at load time**:

| Can be patched | Can't be patched |
| --- | --- |
| Scripts (`.c`) | Binarized models (ODOL `.p3d`) |
| Text configs (`config.cpp`) | Textures (`.paa`) |
| | Binarized configs (`config.bin`) |

The pattern is simple: the things that **aren't binarized** can be loaded loose, and the things
that **are** can't. Scripts always ship as text, so they patch perfectly. Assets go through the
binarizer when you pack, so changing a model or texture still means going back through the
modeling tools and **repacking** — file patching won't shortcut [asset work](/asset-work/overview/).

## Works patched, breaks packed

This is the failure mode to internalize. Because loose files are looser than a packed PBO, a mod
can run flawlessly under file patching and then break the moment it's packed — especially on a
real (Linux) server. The usual culprits:

- **Path case.** Loose files on Windows are case-insensitive; a binarized PBO on a **Linux
  server** is not. A script that references `Data/Foo.paa` when the file is really
  `data/foo.paa` works patched and fails packed-on-Linux. Keep paths and filenames consistently
  **lowercase**.
- **Missing or wrong `$PBOPREFIX$`.** Loose loading resolves files by their on-disk folder path;
  packed loading resolves them by the [prefix](/tooling-setup/packing/#the-pboprefix-path-prefix).
  If the prefix is absent or wrong, paths that resolved fine loose break once packed.
- **Binarization-only errors.** Some mistakes only surface when the binarizer actually runs over
  a model or config. Patched, the binarizer never ran — so the error never appeared.
- **Files that don't get packed.** A file you edited loose but your packer's include rules skip
  is present when patched and missing when packed.

:::caution[Always do a final packed test]
Before publishing, turn `-filePatching` **off**, repack, and run the mod from its real PBO.
Bugs that hid behind loose files show up here — and this is the version players actually get.
The client/server `.RPT` log is your first stop when packed behaviour diverges from patched.
:::

## Related

- [Packing](/tooling-setup/packing/) — the pack step file patching lets you skip while iterating.
- [Project workflow](/tooling-setup/project-workflow/) — laying out a project so loose and
  packed builds stay clean.
- [Scripting overview](/scripting/overview/) — what you'll actually be iterating on.
- [Common gotchas](/scripting/common-gotchas/) — more "why does it behave differently" traps.
