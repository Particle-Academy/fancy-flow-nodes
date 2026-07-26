# AGENTS.md — fancy-flow-nodes

The **first-party fancy-flow node marketplace**. `CLAUDE.md` symlinks here. Read
the envelope's `AGENTS.md` too.

## The rule that shapes this repo

**Nodes are VENDORED SOURCE, not published packages.** `fancy-cli add node`
copies a node's files into the consumer's project the way `add <component>`
copies a component's — so a node lands in the app, readable, editable and
diffable, instead of hidden in `node_modules` or `vendor`.

Nothing here is published. This repo is `private: true` on the npm side and not
on Packagist; the registry reads these directories and serves the file contents,
and the CLI writes them.

**One node, one source.** Every node is a single directory carrying all three
parts — surface, JS backend, PHP backend. Do not split a node across repos or
packages; both were tried and both were wrong.

Core's 27 builtins ship with the engine and are not here.

## Layout

```
nodes/<name>/
  fancy-flow.node.json    the manifest: `ui` + per-runtime `files`
  fixtures/*.json         golden fixtures — both backends run these
  README.md               the node's own docs
  ui/                     the React kind — copied whichever backend is chosen
  js/                     the TypeScript executor
  php/                    the PHP executor
tests/<name>/             its TS tests
tests/php/                its PHP tests
scripts/manifests.mjs     validate every manifest; print registry paths
```

`ui` sits OUTSIDE `runtimes` on purpose. The editor is React on every host, so a
Laravel project needs the React kind and does **not** need the TypeScript
executor. Fold them together and a PHP host either loses its palette entry or
gains a second implementation of a node it runs once.

## Adding a node

1. `nodes/<name>/` — manifest, fixtures, README, and `ui/` + `js/` + `php/`.
2. `npm run manifests` — it validates through the engine's own validator and
   checks every declared directory exists. A manifest naming a directory that
   is not there is a node the registry serves with files missing, and the CLI
   copies half a node in silence.
3. Register it in the sandbox:
   `php artisan flow:register-node nodes/<name>/fancy-flow.node.json`.

No build step, no exports map, no version bump. The files ARE the node.

## What every node here owes

1. **Declare intent; let a host apply it.** A node that reaches for a global —
   the DOM, an SDK, a connection — forces it on every consumer. Declare a
   capability contract and let the host register an implementation, the way core
   does for `LlmClient`. The same graph then runs in a browser, on a worker, or
   against a recorder in a test.

2. **Fail loudly, never no-op.** A node that can't do its job must throw. The
   alternative is a run that did nothing and reported `ok: true` — no exception,
   no log line, a green row. That silent success is the failure mode this whole
   suite is arranged against.

3. **The manifest tells the truth.** Claim only runtimes that exist. Say
   `unsafe-to-replay` if anything about the node isn't idempotent — durable runs
   retry. Declare capabilities so an editor can grey the node out instead of
   letting a run silently no-op. A manifest that overstates is worse than none.

## Conventions

- **No runtime dependencies.** `@particle-academy/fancy-flow` is a dev
  dependency here and a peer in the consumer's project — a node's source imports
  it, and the consumer already has it.
- **Import the engine from `/engine`, never `/registry`.** The registry barrel
  re-exports a React component; `/engine` has the same functions React-free
  (0.30.0+). A headless test that imports `/registry` fails a clean install with
  "Cannot find package 'react'".
- **Fixtures run against the real executor**, with a recording host registered
  in `beforeAll` — not in the `describe` body, which runs during collection and
  leaves no host installed when a case runs.
- **Surface behaviour is tested against a real document** (jsdom), reading the
  element back. A mock that agrees with whatever we wrote proves nothing.

## Commands

```bash
npm install
npm test           # vitest — every node's fixtures + behaviour + packaging
npm run lint       # tsc --noEmit
npm run manifests  # validate every manifest, print registry paths
```

## Shipping

**Nothing is published.** No npm, no Packagist, no tags. A node reaches
consumers the moment its manifest is registered and the registry can read this
repo — push to `main`, re-register any manifest that changed, and advance the
envelope pin.

Production deploys only px-ui-sandbox, so the registry cannot read these
directories there; the compiled registry artifact carries the file contents,
the same arrangement the component registry uses.
