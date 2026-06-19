---
title: Scripting overview
description: How EnScript and the DayZ engine fit together, and what this section covers.
sidebar:
  order: 1
  label: Overview
---

DayZ is scripted in **EnScript** (Enforce Script), the engine's own
statically-typed, C-like language. This section covers the practical reality of
working with it — the parts that bite people, the subsystems you'll actually touch,
and how the game is structured underneath your code.

Scripting and [asset work](/asset-work/overview/) overlap constantly: a weapon, a
vehicle, or an item is part model, part config, part script. Expect to jump between
the two.

## What this section covers

- **[EnScript basics](/scripting/enscript-basics/)** — types, classes, modules, and
  the things that differ from languages you already know.
- **[Common gotchas](/scripting/common-gotchas/)** — the sharp edges: ref counting,
  null handling, client/server split, mod load order.
- **[Engine subsystems](/scripting/engine-subsystems/)** — the systems you reach for
  most: inventory, actions, RPC, persistence, and more.
- **[Game structure](/scripting/game-structure/)** — how the codebase is laid out and
  how mods slot into it.

## What this section is not

It's **not** a generated API dump of the unpacked source. Raw Doxygen-style
references don't deliver the value people actually want. Instead we document the
subsystems and native functions people frequently use, with worked examples and the
context that a raw reference can't give you.

## Where to start

If you're new to EnScript, read [EnScript basics](/scripting/enscript-basics/) first,
then skim [Common gotchas](/scripting/common-gotchas/) before you write much — it'll
save you hours.
