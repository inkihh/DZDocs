---
title: Modding overview
description: A high-level map of how DayZ mods are built — scripting versus asset work, and how the pieces fit together.
sidebar:
  order: 2
---

"Modding DayZ" covers two intertwined disciplines and the toolchain that ties them
together. This page is the map — just enough of the whole picture that the rest of the
site has something to hang off. It links out to the detail rather than repeating it.

If you just want to get your tools working, skip ahead to
[Workbench setup](/getting-started/workbench-setup/) and come back here later.

## The two halves: scripting and asset work

Almost everything you'll do falls into one of two buckets.

**Scripting** is code. DayZ runs on Bohemia's **Enfusion** engine and is scripted in
**Enforce Script** (EnScript) — a statically-typed, C-like, object-oriented language.
If you know C# or Java it'll feel familiar; it is *not* C++, and it is *not* Lua. Scripts
hold gameplay logic: what an item does when you use it, how a system behaves, what the
server decides. Start with [Scripting](/scripting/overview/).

**Asset work** is everything the engine renders or reads as data:

- **Models** — the `.p3d` file (geometry, levels of detail, named selections, attachment
  points).
- **Materials** — `.rvmat` files that describe how a surface responds to light.
- **Textures** — `.paa` images (color, normal, specular maps), compiled from source art.
- **Configs** — `config.cpp`, the text that declares your content to the game and wires
  the model, materials, and behaviour together.

Start with [Asset Work](/asset-work/overview/).

### Why the two overlap

A single in-game item is **never just one file**. A weapon is a model *and* a set of
materials *and* textures *and* a config class that declares it — *and* often a script that
gives it custom behaviour. These pieces reference each other **by name**: the config's
`model` points at a `.p3d`, and a config field like `hiddenSelections[]` has to match the
named selections baked into that model. Get a name wrong in one place and it breaks in
another.

That cross-referencing is why this site links so heavily between scripting and asset
pages — they're two views of the same object, not separate worlds.

## The shape of a mod on disk

A finished mod is a folder, by convention prefixed with `@`:

```text
@MyMod/
├── mod.cpp          # name, author, version (presentation metadata)
├── meta.cpp         # Steam Workshop metadata (auto-generated)
├── Keys/
│   └── MyMod.bikey  # public signature key the server checks
└── Addons/
    └── mymod.pbo    # your packed content (one or more PBOs)
```

The content itself lives inside the **PBO** ("Packed Bohemia Object") — a single packed
archive the game loads. Before packing, that same content is just a source folder
containing a `config.cpp`, your models and textures, and your scripts. An **addon** is any
such folder whose config declares it; small mods are a single addon in a single PBO.

The `config.cpp` is the spine. Two parts matter early:

- **`CfgPatches`** declares the addon and its dependencies (`requiredAddons[]`) — this is
  also what controls **load order**.
- **`CfgMods`** registers your **script modules** so the engine knows where your code lives.

```cpp
class CfgPatches
{
    class MyMod
    {
        units[] = {};
        weapons[] = {};
        requiredVersion = 0.1;
        requiredAddons[] = { "DZ_Data" };  // load after the base game data
    };
};
```

Scripts are organised into numbered **modules** that compile in a fixed order, roughly
engine-core → game → world → mission:

```text
scripts/
├── 3_Game/      # game-wide logic
├── 4_World/     # entities and items
└── 5_Mission/   # HUD, menus, the player's session
```

(There are five — `1_Core` and `2_GameLib` come first — but `3_Game`, `4_World`, and
`5_Mission` are the ones you'll touch.) A lower module can't see a higher one: code in
`3_Game` can't reach `5_Mission`, but `5_Mission` can use everything below it. The
[Game structure](/scripting/game-structure/) page goes deeper.

So the whole lifecycle, in one line: **source files → declared by `config.cpp` → packed
into a `.pbo` → dropped in `@MyMod/Addons/` → signed with a `.bikey` → loaded by the
game.** [Packing](/tooling-setup/packing/) and [Publishing](/tooling-setup/publishing/)
cover the back half.

## Where the game ends and your mod begins

The base game's own content lives in its addons (the data root you'll see referenced as
`DZ`, with the core addon `DZ_Data`). After you extract the game data during
[Workbench setup](/getting-started/workbench-setup/), you can read all of it — that's your
reference for how Bohemia builds things.

The key idea is that **mods extend the game; they don't replace it.** You rarely edit a
vanilla file. Instead:

- **`modded class`** lets you bolt onto an existing class without touching the original —
  you `override` just the methods you care about and call `super` to keep the original
  behaviour. (See [EnScript basics](/scripting/enscript-basics/).)
- **Config inheritance** lets your item inherit from a vanilla one and change only what's
  different.
- **`requiredAddons[]`** guarantees your addon loads *after* whatever it builds on, so the
  classes you're extending already exist.

The game itself is launched with your mod via the `-mod=` parameter pointing at the
`@MyMod` folder.

## The toolchain at a glance

You don't assemble any of this by hand. The free **DayZ Tools** suite (on Steam) gives you:

- **Workbench** — the scripting and engine-side workspace, with a live script debugger.
- **Object Builder** — the 3D model tool, where P3Ds are built and configured.
- **Addon Builder** — packs a source folder into a `.pbo`.
- **Publisher** — uploads finished mods to the Steam Workshop.

Everything is rooted on a virtual **`P:` drive** that mirrors the game's filesystem. Setting
that up correctly is the first real hurdle, and it has its own page:
[Workbench setup](/getting-started/workbench-setup/). The wider build-and-ship workflow lives
under [Tooling & Setup](/tooling-setup/overview/).

## The learning curve (and where people get stuck)

Be honest with yourself going in: DayZ modding has a steep start. The hard part usually
isn't the concepts — it's that the knowledge is scattered, often assumes prior Arma
experience, and leaves gaps exactly where beginners need help. That gap is the reason this
site exists.

The places people most often lose time:

- **Tool setup.** The `P:` drive and game-data extraction trip up almost everyone first.
  [Workbench setup](/getting-started/workbench-setup/) is written to get you past it.
- **The asset pipeline.** Levels of detail, named selections, memory points, materials, and
  texture-map naming all have to be exactly right, and a small mistake fails quietly. See
  [Asset Work](/asset-work/overview/).
- **EnScript's sharp edges.** Reference counting and the client/server split cause a whole
  category of "it works, then it doesn't" bugs. Skim [Common gotchas](/scripting/common-gotchas/)
  before you write much — it saves hours.

None of it is beyond a careful beginner. Set up your tools, copy how the base game does
something, change one thing at a time, and read the logs when it breaks.

## Related

- [Workbench setup](/getting-started/workbench-setup/) — get your tools working first.
- [Scripting overview](/scripting/overview/)
- [Asset Work overview](/asset-work/overview/)
- [Tooling & Setup overview](/tooling-setup/overview/)
