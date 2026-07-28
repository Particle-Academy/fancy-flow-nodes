# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**Nothing here is published**, so entries are dated rather than versioned: a
node reaches consumers when its manifest is registered, not when a tag lands.
Each entry says which node it is about, and a node already copied into a project
does not change under you — re-run `fancy-cli add node <kind> --overwrite` to
take an update.

## [Unreleased]

### Changed

- Widened the `particle-academy/fancy-flow-php` requirement from `^0.9` to `>=0.8 <2.0`, so a sibling
  minor release is an upgrade and not a resolver conflict. **No action needed** —
  widening a range only adds candidates; the version you have today still resolves.

  A caret on a `0.x` range locks the MINOR, so every one of these pinned a
  sibling at whatever it happened to be on the day it was written, and each
  sibling release then read as a conflict to Composer/npm rather than an
  upgrade. Nothing in this package was using an API the newer minors removed
  — the range was the whole problem.

### Added

- **`llm_input`** — ask a model to write the form a step pauses on, from the
  run's own data.

  Core's `user_input` pauses on a form somebody wrote at design time, and that
  stays the right node whenever the questions are known in advance. This one is
  for when they are not: a triage step whose questions depend on the ticket, a
  follow-up that asks only for what is still missing.

  It pauses with **the same detail shape `user_input` emits** (`{ title, fields }`,
  plus `generated: true`), so a host that already renders a paused run renders
  this with nothing new wired — a generated form is a form, not a new kind of
  wait.

  A model returns plausible JSON, not correct JSON, so the form is checked
  before the run parks: no empty forms, no keyless or unlabelled fields, no two
  fields sharing a key (one silently overwrites the other on submit), no
  optionless `select`, and every key in `requiredKeys` present — without that
  last one a downstream node reading `values.email` breaks silently because the
  model chose `emailAddress`. All problems are reported at once.

- **`llm_screen`** — let a model build the interface a step shows, rendered by
  fancy-screens' schema surface.

  `<Screen schema={…}>` already maps a JSON page description through a component
  registry; it had no workflow node reaching it. So a workflow could pause on a
  form and could not put up a summary, a comparison, or a dashboard over
  whatever the run found.

  The node contributes what fancy-screens cannot do from where it sits: telling
  the model which components exist, and **refusing a schema that names one that
  does not**. fancy-screens renders an unknown name as a visible placeholder —
  right for a developer typing a schema, wrong for a workflow, where it means an
  error message is delivered to a person while the run reports success. An
  unknown name is reported once rather than once per occurrence, followed by a
  line naming what *is* registered, since the fix is usually the registry.

  First node to declare `fancyDependencies` (fancy-flow 0.33.0+): `fancy-screens`
  required, `react-fancy` optional. `fancy-cli` 0.5.0+ prints the install routes
  when you add it.

### Changed

- **`ui_effect`'s README documented the wrong install.** It still described the
  npm-subpath model — `import … from "@particle-academy/fancy-flow-nodes/ui-effect"`
  — which the vendored redesign replaced. Nodes are copied into your project;
  the imports are now the paths the CLI actually writes.

### Fixed

- **`CLAUDE.md` was a stale copy, not a symlink**, so it claimed to symlink
  `AGENTS.md` while serving the pre-vendoring instructions underneath. Now an
  actual symlink, as in every other repo.


### Added

- **Five PR-lifecycle nodes** — `git_pr_open`, `git_pr_list`, `git_pr_get`,
  `git_pr_checks`, `git_pr_compare`. They wrap `fancy-git-js` / `fancy-git-php`,
  whose provider contract is neutral across GitHub, GitLab and Bitbucket, so one
  graph runs against any of them.

  Each routes on the answer rather than returning it flat, because the branch is
  the point: `git_pr_list` splits `found` / `none`, `git_pr_compare` splits
  `ahead` / `same`, and `git_pr_checks` has **four** ports — `pending` is not
  `failing` and `none` is not `passing`. Collapse those and a workflow either
  abandons work that was still building, or auto-merges a repository whose CI
  was never configured.

  No credentials of their own: a host registers a `fancy-git` provider registry
  once, and a node with no host **throws** rather than reporting a green run
  that never opened the pull request anyone was waiting for. Only `git_pr_open`
  is `unsafe-to-replay` — a retry would open a second PR for the same branch.

  Issue-shaped operations are deliberately absent: the provider contract has no
  issues API, and adding one means changing a published contract in both git
  packages first.

## 2026-07-26 — vendored source

There are no versions here. Nothing is published: a node reaches consumers the
moment its manifest is registered and the registry can read this repo. Entries
are dated, and each says which node it is about.

### Added

- **The marketplace itself.** Every first-party fancy-flow node lives here, and
  `fancy-cli add node` **copies** one into a project the way `add <component>`
  copies a component — source you can read, edit and diff, rather than a
  dependency hidden in `node_modules` or `vendor`.

  Each node is one directory carrying all three parts: `ui/` (the React kind,
  copied whichever backend you pick), `js/` and `php/` (the executors). The
  manifest declares `ui` separately from `runtimes` because the editor is React
  on every host — a Laravel project needs the React kind and does not need the
  TypeScript executor.

- **`@particle-academy/ui_effect`** (`./ui-effect`) — change how a live surface
  looks from a workflow. Six operations (add / remove / toggle / replace a
  class, set a CSS custom property, set an inline style) plus `durationMs`,
  which reverts the effect afterwards. A pulse is `add-class` + `1200`; a theme
  change is `set-var` on `page`.

  The node never touches the DOM: it resolves an intent and hands it to a
  registered `UiEffectHost`, so the identical graph runs in a browser, behind a
  relay from a queue worker, or against a recorder in a test.
  `createDomUiEffectHost()` is used automatically when a document exists, so the
  browser case needs no setup — it resolves `page` to the document root, then a
  stable `[data-fancy-id]` handle, and only then a CSS selector.

  Optional `./ui-effect/effects.css` ships `ff-fx-glow` / `pulse` / `flash` /
  `shake`, tinted by `--ff-fx-color`, all honouring `prefers-reduced-motion`.

  A target that matches nothing throws, and so does a run with no host and no
  document. Both would be easy to no-op; both would then produce a run that
  styled nothing and reported success. Declares `sideEffects:
  "unsafe-to-replay"` because `toggle-class` is not idempotent on a retry — the
  other five operations are. TypeScript runtime only, and the manifest says so.

[Unreleased]: https://github.com/Particle-Academy/fancy-flow-nodes/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Particle-Academy/fancy-flow-nodes/releases/tag/v0.1.0
