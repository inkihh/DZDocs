---
title: Publishing
description: Getting a finished mod onto the Steam Workshop.
sidebar:
  order: 4
---

Once a mod is [packed](/tooling-setup/packing/) and signed, publishing puts it on the **Steam
Workshop** so players (and servers) can subscribe to it. The official **Publisher** tool in
DayZ Tools handles the upload; the parts that trip people up are the metadata files that tie
your folder to a Workshop item. This page covers preparing a mod, uploading and updating it,
versioning hygiene, and the rejections people hit most.

## Before you publish

Publish a mod the way players will run it, not the loose dev version:

- **Pack for real.** Build the PBO with binarization on and [file patching](/tooling-setup/file-patching/)
  off, and test that packed build. The Workshop copy is the one players get.
- **Sign client content.** Anything clients download needs a valid `.bisign`, and your public
  `.bikey` must be in the mod's `keys/` folder — see
  [Signing](/tooling-setup/packing/#signing). An unsigned mod uploads fine and then gets
  signature-kicked on verifying servers.
- **Have a preview image.** The Workshop needs one for the item to present properly.

A publish-ready mod folder (`@ExampleMod/`) typically holds the packed `addons/`, a `keys/`
folder with the public `.bikey`, the metadata files below, and a preview image.

## The two metadata files

DayZ mods carry two small `.cpp` files that are easy to confuse. They do **different jobs**:

| File | Job | Key fields |
| --- | --- | --- |
| `meta.cpp` | **Workshop identity** — ties the folder to a Workshop item | `publishedid`, `name` |
| `mod.cpp` | **Presentation** — how the mod shows itself in the launcher | `name`, `picture`, `logo`, `author`, `action` |

### `meta.cpp`, the one that bites

`meta.cpp` carries the **`publishedid`**: the numeric ID of your item on the Workshop. The
Publisher writes it on your **first** upload, and it's what makes every later upload **update**
that same item instead of creating a new one.

:::caution[`publishedid = 0` means "not a real Workshop item"]
If `meta.cpp` is missing or its `publishedid` is `0`, the mod isn't tied to a Workshop item —
servers and clients reject it and players can't connect (you'll see a "failed to find
publishedid in meta.cpp" error). The fix is to **let the Publisher own `meta.cpp`**: publish
through the tool and keep the folder it generated, rather than packing by hand and dropping the
generated `meta.cpp`.
:::

### `mod.cpp` — presentation

`mod.cpp` is optional but worth filling in — it's how your mod presents in the launcher and
in-game mod list. Common fields are `name`, `author`, `description`, `picture`/`logo` (the
artwork), and `action` (a URL, e.g. your Discord or docs). It has nothing to do with Workshop
identity; that's `meta.cpp`'s job.

## Uploading and updating

The **Publisher** (part of DayZ Tools) does the upload:

1. Point it at your mod folder (`@ExampleMod/`).
2. Fill in the **title, description, tags, and preview image**.
3. Upload. On the first upload Steam assigns the item ID and the Publisher records it in
   `meta.cpp` as `publishedid`.
4. To **update**, publish the **same folder** again — because `publishedid` is now set, Steam
   updates the existing item.

:::note[Tool labels shift between versions]
Exact field names and buttons in the Publisher have changed across DayZ Tools releases. The
constants are: point it at the mod folder, give it a preview image, and reuse the same folder
for updates so it updates rather than duplicates.
:::

## Versioning and changelog hygiene

Server owners run your mod in production, so tell them what changed each time you push:

- **Write a changelog per update.** The Workshop has a changelog field on every update — say
  what changed and whether it's breaking, so owners know if a server-side adjustment is needed.
- **Keep a human version string** (in your `mod.cpp` description or a `CHANGELOG` in the repo),
  so "the version on the server" maps to "the commit you built it from."
- **Mind the timing.** Pushing an update forces subscribers to re-download, sometimes mid-
  session. Coordinate larger changes with the servers that depend on you.

## Common rejections and pitfalls

- **`publishedid = 0` / missing `meta.cpp`** — the item isn't recognized; players can't connect.
  Republish through the Publisher and keep its `meta.cpp`.
- **A fresh folder without the existing `meta.cpp`** — Steam can't tell it's the same mod and
  creates a **duplicate** item. Always reuse the folder the Publisher knows.
- **Unsigned client PBOs** — they load from the Workshop but get signature-kicked on servers
  with `verifySignatures` on. [Sign](/tooling-setup/packing/#signing) before publishing.
- **No or oversized preview image, or missing tags** — the item won't present correctly.

## Workshop vs. direct server-mod distribution

Not everything goes on the Workshop. **Client and shared mods** are published there so players
auto-download them on join. **Server-only mods** — the [`-servermod`](/tooling-setup/packing/#when-to-sign-and-when-not-to)
PBOs — usually aren't on the Workshop at all; the server owner drops them straight onto the
server. If you're shipping a server-only addon, publishing may not even apply.

## Related

- [Packing](/tooling-setup/packing/) — build and sign before you publish.
- [Project workflow](/tooling-setup/project-workflow/) — where `meta.cpp`/`mod.cpp` and keys live.
- [File patching](/tooling-setup/file-patching/) — turn it off and test the packed build first.
