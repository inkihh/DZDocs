@TASK.md
@README.md
@CONCEPT.md
@IMPLEMENTATION.md
@RESEARCH.md

# Key files

* **IMPLEMENTATION.md** — In-depth technical reference: architecture, every class with fields and methods, data flows, persistence, build system, config files, changelog. Read this first at the start of every session — it should be enough to orient without scanning source files. No product-level rationale — that belongs in CONCEPT.md.
* **CONCEPT.md** — Internal product view: what the mod does and why, from a design perspective. Feature definitions, behavior rules, milestones. No code-level details (class names, method signatures, file paths) — those belong in IMPLEMENTATION.md.
* **README.md** — Customer-facing: how the mod works, installation, configuration, dependencies. No internal architecture or code references.
* **TASK.md** — The current task being worked on.
* **RESEARCH.md** — Research tools and results

# General rules

* You may edit or create all files.
* Never build, run, or deploy anything without explicit permission.
* Don't touch IMPLEMENTATION.md or CONCEPT.md until I give explicit clearance that the current task is completed.
* Update README.md as soon as you are done with the task (before I sign off that it is done).

# Task planning

When I tell you to start planning a task:

1. Check that TASK.md is clear. If not, ask for confirmation that the previous task was completed.
2. Write a plan in TASK.md describing what should be done.
3. Ask single questions (using AskUserQuestion) until the plan is clear and unambiguous. Also ask questions to offer improvements. Weave clarifications directly into the plan rather than a separate section.
4. Ask for explicit clearance to start implementation.

# Backlog planning

Same as task planning, but for items that aren't ready to start yet (a task may already be running in TASK.md). When I tell you to plan a backlog item:

1. Create `backlog/<item-shortname>.md` (pick a concise kebab-case shortname from the topic).
2. Write the plan in that file, same structure as a TASK.md plan.
3. Ask single questions (using AskUserQuestion) until the plan is clear and unambiguous. Also ask questions to offer improvements. Weave clarifications directly into the plan rather than a separate section.
4. Do not ask for implementation clearance — backlog items are parked until promoted to TASK.md later.

# Promoting a backlog item to a task

When I tell you to pick up a backlog item as the new task:

1. Check that TASK.md is clear. If not, ask for confirmation that the previous task was completed.
2. Read `backlog/<item-shortname>.md`.
3. Re-validate the plan against the current state of the codebase and docs (IMPLEMENTATION.md, CONCEPT.md, README.md, relevant source). Things may have changed since the backlog item was written — file paths, class names, features, dependencies, assumptions. Flag anything stale or broken.
4. If anything is stale, ask single questions (using AskUserQuestion) to update the plan. Weave updates directly into the plan.
5. Move the refreshed plan into TASK.md and delete `backlog/<item-shortname>.md`.
6. Ask for explicit clearance to start implementation.

# During implementation

* When you say a task is done, I may ask for bug fixes and additions.

# Task completion

Once I give clearance that the task is completed:

1. Update IMPLEMENTATION.md to reflect all changes introduced by the task (including subsequent bug fixes and additions).
2. Review CONCEPT.md — update if the concept changed during the task, and mark any completed milestones as done.
3. Clear out TASK.md.
4. Commit and push everything, and confirm the working tree is clean.
