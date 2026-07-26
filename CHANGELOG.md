# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

One version covers every node in the package, so each entry says which node it
is about.

> **Pre-1.0:** breaking changes land in MINOR releases. Until 1.0 the minor
> number is not a compatibility promise — read the entry, not the version.

## [Unreleased]

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
