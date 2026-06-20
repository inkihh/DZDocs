---
title: Packing
description: Turning mod source into PBOs the game can load.
sidebar:
  order: 2
---

A mod on disk is a folder of source files; a mod the game loads is a **PBO**. Packing is the
step that turns one into the other — it bundles your addon's files into a single archive,
optionally **binarizes** them, and (when needed) **signs** the result so servers will accept
it. This page covers what a PBO is, the path-prefix file that makes it resolvable, packing
with the official tools, and signing.

If your environment isn't set up yet, do [Workbench setup](/getting-started/workbench-setup/)
first — packing assumes the `P:` drive and a source folder in place.

## What a PBO is

**PBO** stands for *Packed Bank Object*. It's a flat archive holding one addon's entire file
tree — a `config.cpp` (or binarized `config.bin`) at the root, plus `scripts/`, models
(`.p3d`), materials (`.rvmat`), textures (`.paa`), sounds, and UI layouts. It is **not
compressed**; think of it as a container that staples the folder into one file the engine can
mount.

One mod is one *or more* PBOs. A common split is a shared/client PBO plus a server-only PBO —
see [Project workflow](/tooling-setup/project-workflow/#splitting-into-addons).

### Binarize vs pack-only

Packing can optionally **binarize** your content — compiling text into the engine's optimized
runtime forms: `config.cpp → config.bin`, and models from editable MLOD to runtime ODOL (the
[MLOD vs ODOL](/asset-work/pipeline-and-formats/#mlod-vs-odol-the-one-distinction-to-get-right)
distinction). **Scripts are never binarized** — `.c` files always ship as text and compile
when the game loads them. So a script-only mod can be packed *pack-only*, with binarization
off; an asset mod almost always wants binarization on.

:::caution[Binarizing is one-way — keep your sources]
Binarization is a compile step with no supported route back, and de-binarizing someone else's
assets is **against the DayZ EULA**. Keep your editable MLOD `.p3d` and layered textures in
source control; the PBO only ever holds the binarized copy. See
[Pipeline & formats](/asset-work/pipeline-and-formats/#mlod-vs-odol-the-one-distinction-to-get-right).
:::

## The `$PBOPREFIX$` path prefix

Inside a PBO, files are addressed by a **virtual path**, and that path is set by a tiny text
file in your addon's source root named exactly `$PBOPREFIX$` (no extension). It holds **one
line**: the addon's namespace.

```text
Acme\ExampleMod
```

That single line is load-bearing. With the prefix above, a texture stored in the PBO at
`data\barrel_co.paa` is addressed engine-wide as `Acme\ExampleMod\data\barrel_co.paa`. Every
path string in your configs, RVMATs, and scripts is resolved against that virtual root — so the
prefix is the contract between "where the file sits in the PBO" and "what name the rest of the
game uses to find it."

:::caution[A wrong prefix fails *quietly*]
If `$PBOPREFIX$` is missing, misspelled, or doesn't match the paths your configs expect, the
engine looks in the wrong place and simply doesn't find the file — a grey model, an untextured
face, an addon that won't load, and **no obvious error**. Make the prefix **unique to your
mod** (a vendor/author segment plus the mod name is the usual shape) so it never collides with
another addon in the load order.
:::

Conventions for the file: one line, no trailing newline, no surrounding spaces. When a packer
binarizes with a prefix argument it writes this file for you, but authoring it yourself keeps
it explicit and under version control.

## Packing with the official tools

The official packer in **DayZ Tools** is **Addon Builder**. The general flow:

1. Point it at your **source project folder** — the folder that *is* the addon (the one holding
   `$PBOPREFIX$` and `config.cpp`). **Not** bare `P:`, or it tries to scan the whole drive and
   crawls.
2. Set the **destination** (your packed-output folder, e.g. `P:\Mods\@ExampleMod\addons`).
3. Choose **binarize** on or off (off for a script-only addon, on for assets).
4. Optionally set a **signing key** so it signs while it packs (see below).
5. Build. The result is a `.pbo` (plus a `.bisign` if you signed).

Addon Builder runs as a GUI and from the command line, so the same operation can be scripted
into a one-command build — see [Project workflow](/tooling-setup/project-workflow/#scripting-the-build).

:::note[Tool labels shift between versions]
The exact button and field names ("path to project folder", "destination", the binarize
toggle) have moved around across DayZ Tools releases. If a label here doesn't match yours, look
for the nearest equivalent — pointing it at the *addon folder* and choosing *binarize* are the
two things that matter.
:::

:::tip[Lowercase your packed files]
The packed `addons` folder and the files inside must be **lowercase**. Windows won't care, but
Linux DayZ servers refuse mixed-case PBOs — and you'll only find out when someone runs your mod
on a real server. This is the same rule called out in [Workbench setup](/getting-started/workbench-setup/).
:::

## Signing

Servers that enforce signature checks won't load a client mod unless it's **signed** with a key
they trust. Signing has two halves — a key pair you make once, and a signature you produce per
PBO.

### The key pair

DayZ Tools' **DS Utils** generates a key pair (via `DSCreateKey`, or the `DSUtils` GUI):

- **`.biprivatekey`** — the **private** key. Used to sign. **Secret — never distribute it, and
  never commit it to source control.** Whoever holds it can sign as you.
- **`.bikey`** — the matching **public** key. Distributed freely; server owners drop it into
  their server's `keys/` folder so they can verify your mod.

You make the key pair **once** and reuse it for everything you publish — keeping the same key
means servers that already trust you don't have to add a new one.

### Signing a PBO

Signing a PBO with the private key produces a **`.bisign`** file that ships *next to* the PBO
(e.g. `ExampleMod.pbo` + `ExampleMod.pbo.<keyname>.bisign`). You can sign during packing
(Addon Builder's signing option) or afterward with `DSSignFile`. On the server side,
`serverDZ.cfg` `verifySignatures = 2;` makes the server check that each client PBO's `.bisign`
matches a `.bikey` it holds — a mismatch or a missing signature gets the player kicked.

### When to sign, and when not to

This trips people up, so be precise about it:

| Mod kind | Loaded with | Signature-checked? | Sign it? |
| --- | --- | --- | --- |
| Client / shared mod | `-mod=` | Yes, on verifying servers | **Yes** |
| Server-only mod | `-servermod=` | No — never sent to clients | **No** |

**Sign anything clients download.** A client or shared mod on a server running
`verifySignatures` needs a valid `.bisign`, and the server needs your `.bikey`. **Server-only
mods don't need signing** — they run only on the server, never travel to clients, and aren't
signature-checked. Local single-player testing doesn't strictly need signing either, though
signing during development surfaces key/packaging problems early.

## Verifying a packed mod loads

Before you ship, confirm the PBO actually loads:

- **Launch with your mod.** `-mod=@ExampleMod` (and `-servermod=@ExampleMod_Server` for a
  server PBO). A working mod appears in the in-game mod list and its content shows up.
- **Read the RPT.** If something's wrong, the client/server `.RPT` log in the profile directory
  is the first place to look — missing-file and config errors land there.
- **Watch for the "works unpacked, breaks packed" trap.** A mod that ran fine under
  [file patching](/tooling-setup/file-patching/) can still fail once packed — usually a
  path-case mismatch or a wrong `$PBOPREFIX$`. Always do a final **packed** test with file
  patching *off*.

## Related

- [File patching](/tooling-setup/file-patching/) — iterate without repacking every change.
- [Publishing](/tooling-setup/publishing/) — get the signed, packed mod onto the Workshop.
- [Project workflow](/tooling-setup/project-workflow/) — layout, source control, and scripting the build.
- [Pipeline & formats](/asset-work/pipeline-and-formats/) — what binarization does to your assets.
