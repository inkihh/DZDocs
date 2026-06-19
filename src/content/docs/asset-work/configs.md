---
title: Configs
description: Wiring assets into the game — config.cpp for vehicles, weapons, optics, and items.
sidebar:
  order: 8
  badge:
    text: stub
    variant: caution
---

:::caution[Planned page]
This is a scaffold for an upcoming guide. It will likely split into per-asset-type
guides (vehicle, weapon, optic) once there's enough material. Want to take it on? See
[Contributing](/contributing/overview/).
:::

## What this page will cover

- How `config.cpp` ties a model, materials, and gameplay together.
- Class inheritance from vanilla base classes, and what to override vs leave alone.
- Worked examples: a **3D scope/optic** and a **vehicle**, end to end.
- How configs reference [selections](/asset-work/selections-and-naming/),
  [memory points](/asset-work/memory-points/), and [proxies](/asset-work/proxies/).
- Where config meets [scripting](/scripting/overview/).

## Related

- [P3D setup](/asset-work/p3d-setup/)
- [Scripting overview](/scripting/overview/)
