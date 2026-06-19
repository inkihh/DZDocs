---
title: Pull-request process
description: What happens after you open a pull request, and how to make review smooth.
sidebar:
  order: 4
---

Every change to the site lands through a **pull request** — including changes from
core contributors. That keeps the history reviewable and the quality bar consistent.

## The flow

1. **Edit.** Use the **Edit** link at the bottom of a page, or edit the Markdown file
   directly in the repo. GitHub forks the repo for you if you don't have access.
2. **Open a pull request.** Describe what you changed and why. The PR template will
   prompt you for the essentials.
3. **Review.** A core contributor reads it for accuracy, clarity, and fit. Expect
   friendly, constructive feedback — the goal is to get it merged, not to gatekeep.
4. **Merge & deploy.** Once approved, it's merged and the site rebuilds and deploys
   automatically.

## Making review easy

- **Keep PRs focused.** One page or one topic per PR is easier to review than a
  sprawling change.
- **Say what you're unsure about.** Flagging "I'm not certain about this part" helps
  reviewers help you.
- **Preview locally if you can.** Running the site locally (see the repo README)
  catches broken links and formatting before review — but it's not required.

## After merge

The site builds and deploys from the main branch automatically, so your change is
usually live within a few minutes of merging.

## Related

- [Contributing overview](/contributing/overview/)
- [Writing docs](/contributing/writing-docs/)
