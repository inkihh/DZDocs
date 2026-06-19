---
title: Asset Work overview
description: The DayZ modeling and asset pipeline — P3D, proxies, selections, memory points, materials, textures, and configs.
sidebar:
  order: 1
  label: Overview
---

Asset work is where a lot of the demand — and a lot of the pain — lives. Getting a
model into DayZ correctly means understanding the **P3D pipeline**: the model itself,
its LODs, selections and naming, memory points, materials, textures, and the configs
that tie it all to gameplay.

This is one of the two biggest topic areas on the site, and it overlaps heavily with
[scripting](/scripting/overview/) — a weapon or vehicle is part model, part config,
part script.

## What this section covers

- **[P3D setup](/asset-work/p3d-setup/)** — the model format and how a DayZ-ready P3D
  is structured. *(The most-requested topic.)*
- **[Proxies](/asset-work/proxies/)** — attaching sub-models (muzzles, optics, parts)
  the right way.
- **[Selections & naming](/asset-work/selections-and-naming/)** — named vertex/face
  groups and the conventions that make them work.
- **[Memory points](/asset-work/memory-points/)** — the named points the engine reads,
  and which ones each asset type needs.
- **[Materials (RVMAT)](/asset-work/materials-rvmat/)** — how surfaces are shaded.
- **[Textures](/asset-work/textures/)** — the map types (CO / NOHQ / SMDI, …) and how
  they're authored and packed.
- **[Configs](/asset-work/configs/)** — wiring assets into the game: vehicles,
  weapons, optics, and more.

## Worked examples are the goal

The most valuable thing this section can offer is **worked examples** — simple,
"blocky" reference assets and sample files that show a correct setup end to end. The
DayZ Modders GitHub org can host sample mods and source as companion material.

:::note[Original assets only]
Examples here use **original or vanilla** assets. We never redistribute models,
RVMATs, or textures from other people's mods.
:::

## Where to start

If you're setting up your first model, start with [P3D setup](/asset-work/p3d-setup/),
then [selections & naming](/asset-work/selections-and-naming/) and
[memory points](/asset-work/memory-points/).
