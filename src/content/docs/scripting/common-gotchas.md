---
title: Common gotchas
description: The sharp edges of EnScript that cost people the most time.
sidebar:
  order: 3
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

- The **client/server split**: what runs where, and the bugs that come from getting
  it wrong.
- `ref` and ownership mistakes that leak or double-free.
- Null handling and defensive checks the engine won't do for you.
- Mod **load order** and config/script merge surprises.
- `modded class` pitfalls — `super` calls, ordering, and silent overrides.

## Related

- [EnScript basics](/scripting/enscript-basics/)
- [Engine subsystems](/scripting/engine-subsystems/)
