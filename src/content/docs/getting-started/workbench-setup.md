---
title: Workbench setup
description: Setting up the DayZ Tools / Workbench environment cleanly — a common early pitfall.
sidebar:
  order: 3
---

Setting up DayZ Tools is the first real wall in DayZ modding, and it's the one people most
often get wrong. The steps aren't hard, but they're easy to do in the wrong order or skip
entirely — and when the setup is subtly broken, everything afterward fails in confusing
ways. This page walks the whole thing end to end so you only have to do it once.

By the end you'll have the tools installed, the **`P:` drive** mounted, the game data
extracted onto it, and a way to confirm it all actually works.

## Before you start

A few prerequisites save a lot of grief:

- **Own DayZ on Steam** and have it installed. (Modding the Steam version is the supported
  path.)
- **Launch the game at least once** before opening the tools. DayZ Tools checks for a real
  game install, and Workbench will refuse to start — typically with a "game is not
  installed" error — if the game has never been run.
- **Windows.** DayZ Tools is Windows-only (64-bit).
- **Free disk space.** The extracted game data is large. Keep plenty of room free on the
  drive you'll mount `P:` onto — a common rule of thumb is at least ~20 GB.

:::caution[Disk choice matters]
The `P:` drive is mounted *from a folder on a real disk*. Put that folder on a drive with
space to spare (an SSD makes the tools noticeably faster), and avoid a path with spaces in
it.
:::

## Install DayZ Tools

DayZ Tools is a **free** application from Bohemia Interactive, separate from the game
itself:

1. In the Steam library, switch the category filter to **Tools** (or search your library
   for "DayZ Tools").
2. Install **DayZ Tools**, then launch it with **Play DayZ Tools**.

That opens the **DayZ Tools Launcher**, which validates your install and is the jumping-off
point for every individual tool. The suite includes:

- **Workbench** — the scripting and engine-side workspace (script editor + live debugger).
- **Object Builder** — the 3D model tool, where `.p3d` models are built and configured.
- **Addon Builder** — packs a source folder into a `.pbo` for the game to load.
- **Publisher** — uploads finished mods to the Steam Workshop.

You won't need all of them today. The goal right now is the environment underneath them:
the `P:` drive.

## The P: drive, and why it matters

DayZ's tools don't work against scattered files wherever they happen to live. They expect a
single **work drive** — a virtual drive, by convention lettered **`P:`** — that mirrors the
game's filesystem. Everything is addressed by absolute paths rooted at `P:\`: the game's
own data, the textures a model references, and your own mod source all sit under that one
root.

This is *the* concept to get right. If your mod source lives somewhere off `P:`, or you
mount the drive on a different letter, paths stop resolving and the tools quietly fail to
find things.

:::tip[Why `P:` specifically]
You *can* pick another drive letter in the settings, but don't. Sample projects and the
tools' default texture paths are hard-coded to `P:\`. Using a different letter means
fixing those by hand forever. Stick with `P:`.
:::

## Mount the drive and extract the game data

These are **two separate steps**, and conflating them is a classic mistake. Mounting
creates the (empty) `P:` drive; extracting fills it with the game's files.

1. **Mount `P:`.** In the DayZ Tools Launcher's **settings**, set the work-drive path and
   letter (leave it at `P:\`). There's usually an option to mount it automatically on
   startup — turn that on so you don't have to remember after each reboot. Once mounted,
   `P:` appears in Windows Explorer next to your other drives.
2. **Extract Game Data.** From the Launcher, run **Tools → Extract Game Data**. This copies
   the vanilla game files onto `P:` so you can reference and build against them. It can take
   a while (tens of minutes on a slow disk) — let it finish.

After extraction you'll have the game's data on `P:`, including a `scripts` folder with the
vanilla EnScript source — your single best reference for how Bohemia builds things.

:::note[Menu wording varies]
The exact labels ("Extract Game Data", "Mount Drive", where the setting sits) have shifted
between DayZ Tools versions. If a name here doesn't match yours exactly, look for the
nearest equivalent in the Launcher's Tools and Settings — the two operations (mount, then
extract) are what matter.
:::

:::caution[Re-extract after big updates, and mind the EULA]
Re-run **Extract Game Data** after every major game update so your reference data matches
the live game. And note: using the official **Extract Game Data** is fine — that's Bohemia
providing the data for modding. **De-binarizing shipped assets (DeODOL) is not**, under the
DayZ EULA. This site doesn't cover those workflows; the official extract is all you need.
:::

## Where your mod source lives

With `P:` mounted, your own work lives under it too. A simple convention:

```text
P:\
├── DZ\            # vanilla game data (from Extract Game Data) — reference only
├── MyMod\         # your mod source: config.cpp, scripts, models, textures
└── Mods\
    └── @MyMod\
        └── addons\   # packed output (the .pbo Addon Builder produces)
```

Keep your **source** (what you edit) separate from your **packed output** (what the game
loads). When you pack with [Addon Builder](/tooling-setup/packing/), point its "path to
project folder" at your mod's folder — *not* at bare `P:`, or it will try to scan the
entire drive and crawl.

:::caution[Lowercase your packed files]
The packed `addons` folder and the files inside it must be **lowercase**. Windows won't
care, but Linux DayZ servers will refuse to load mixed-case PBOs — and you'll only find out
when someone tries to run your mod on a real server.
:::

Once your tools are working, [Project workflow](/tooling-setup/project-workflow/) covers
laying a project out so it stays maintainable, and [File patching](/tooling-setup/file-patching/)
covers iterating on scripts without repacking every change.

## First-run sanity checks

Before you write a line of mod code, confirm the setup actually took:

- **`P:` is visible in Explorer.** If it isn't, the drive didn't mount — reopen DayZ Tools.
- **`P:` has game data on it.** You should see the extracted folders (e.g. a populated
  `P:\scripts`). If it's empty, Extract Game Data didn't run or didn't finish.
- **Workbench opens** without a "game is not installed" error. If you hit that error, launch
  the actual game once, then try again.
- **Workbench's Resource Browser shows the project tree.** If it's empty, set Workbench's
  **Options → Workbench → source data directory** to `P:\` and restart it.

If all four pass, your environment is sound and the rest of the site's tooling will behave.

## Common mistakes and how to recover

Most setup problems are one of these:

- **"Game is not installed" when opening Workbench.** DayZ has never been run on this
  machine. Launch the game once from Steam, then reopen the tools.
- **`P:` is missing after a reboot.** The drive isn't mounted. Reopen DayZ Tools (and enable
  mount-on-startup in settings so it persists).
- **Tools can't find your files / paths don't resolve.** Your source is off `P:`, or you
  mounted on a non-`P:` letter. Move the source under `P:` and use the `P:` letter.
- **Resource Browser is empty in Workbench.** The source data directory isn't set to `P:\`.
  Fix it in Workbench's options and restart.
- **Packing is endlessly slow.** Addon Builder's project folder is set too broadly (e.g.
  bare `P:`), so it's scanning the whole drive. Point it at your mod's folder instead.
- **Your mod runs locally but not on a server.** Almost always mixed-case file or folder
  names in the PBO. Repack with everything under `addons` lowercase.
- **Something compiles but misbehaves at runtime.** Read the logs. The client and server
  each write an `.RPT` log file (in their profile directory) with script errors and
  warnings — it's the first place to look when behaviour is wrong rather than broken.

## Next steps

With the environment working, you're ready for the actual content:

- [Modding overview](/getting-started/modding-overview/) — the big picture of how a mod fits
  together.
- [Scripting overview](/scripting/overview/) — start writing EnScript.
- [Asset Work overview](/asset-work/overview/) — start building models.

## Related

- [Tooling & Setup overview](/tooling-setup/overview/)
- [Project workflow](/tooling-setup/project-workflow/)
- [Packing](/tooling-setup/packing/)
