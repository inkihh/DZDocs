---
title: Writing docs
description: How to structure a documentation page that's genuinely useful.
sidebar:
  order: 2
---

You don't need to be a professional writer to contribute. A useful page beats a
polished one — and someone can always help you tighten the prose later.

## A page that works

- **Lead with the point.** Say what the page is for in the first line or two. Don't
  bury it under preamble.
- **Write for someone one step behind you.** Assume the reader is competent but new to
  *this* topic. Define the jargon the first time you use it.
- **Show, don't just tell.** A short worked example or a real config snippet is worth
  paragraphs of description.
- **Cross-link generously.** Scripting and asset work overlap — link to related pages
  instead of re-explaining.
- **Be honest about uncertainty.** "This is what works for me; I'm not sure why" is
  more useful than confident hand-waving.

## Practical formatting

- Use **Markdown**. Pages live in `src/content/docs/<discipline>/`.
- Every page needs frontmatter with at least a `title` and a one-line `description`
  (the description is used for search and link previews).
- Use headings to break up the page; the right-hand "On this page" nav builds itself
  from them.
- Use Starlight asides for callouts:

```md
:::tip
A handy aside. Also: :::note, :::caution, :::danger
:::
```

- Add code blocks with a language tag for highlighting:

````md
```cpp
class MyMod_Item : ItemBase {}
```
````

## Picking up a stub

Stub pages already have an outline under "What this page will cover." To fill one in:

1. Remove the `:::caution[Planned page]` block.
2. Remove the `stub` badge from the frontmatter.
3. Write the content, keeping (or improving) the outline's structure.

## See also

- [Style guide](/contributing/style-guide/)
- [Pull-request process](/contributing/pr-process/)
