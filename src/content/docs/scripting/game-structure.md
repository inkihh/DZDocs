---
title: Game structure
description: How the DayZ scripts are laid out, and how mods slot into the codebase.
sidebar:
  order: 5
  badge:
    text: stub
    variant: caution
---

:::caution[Planned page]
This is a scaffold for an upcoming guide. The structure below is the intended
outline — the prose still needs to be written. Want to take it on? See
[Contributing](/contributing/overview/).
:::

## What this page will cover

- The script module layers (`1_Core`, `2_GameLib`, `3_Game`, `4_World`, `5_Mission`)
  and what belongs in each.
- How the game finds and compiles your scripts.
- Where mod scripts hook in, and how merge/override resolves.
- Reading the (legitimately available) game scripts to learn from them.

## Related

- [EnScript basics](/scripting/enscript-basics/)
- [Engine subsystems](/scripting/engine-subsystems/)
