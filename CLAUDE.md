# AGENTS.md — fancy-flow-nodes

The **first-party fancy-flow node marketplace**. `CLAUDE.md` symlinks here. Read
the envelope's `AGENTS.md` too.

## The rule that shapes this repo

**Every published node lives here, in one npm package.** `fancy-cli add node
<anything>` resolves to the same install. Do not split a node into its own repo
or its own package — that was tried, and it means a repo, a CI setup, an npm
Trusted Publisher and a version to track per node, for a seed set of ~11.

Each node gets a **subpath export** (`./ui-effect`), so a consumer who installs
the package for one node bundles one node. The manifest's `entry` field exists
for exactly this: `name` is the package you install, `entry` is the module
inside it.

Core's 27 builtins ship with the engine and are NOT here. You don't install
those.

## Layout

```
nodes/<name>/
  fancy-flow.node.json    the manifest the registry serves
  fixtures/*.json         golden fixtures — required to publish
  README.md               the node's own docs
  index.ts                the subpath entry
  kind.ts                 NodeKindDefinition: palette, config schema, ports
  executor.ts             what it does
src/index.ts              the root barrel + registerFlowNodes()
tests/<name>/             its tests
scripts/manifests.mjs     validate every manifest; print registry paths
```

## Adding a node — four places, all of them

1. `nodes/<name>/` — manifest, fixtures, kind, executor, README.
2. `tsup.config.ts` `entry` **and** `package.json` `exports`. Miss either and
   the node exists in source and is invisible to consumers.
3. `flowNodeKinds` in `src/index.ts`.
4. `npm run manifests`, then register it in the sandbox:
   `php artisan flow:register-node nodes/<name>/fancy-flow.node.json`.

There are tests asserting a manifest names **this** package and points at an
entry the package exports, because those two drift silently.

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

- **No runtime dependencies.** `@particle-academy/fancy-flow` is a *peer* and
  tsup marks it external — bundling it gives a consumer two kind registries, and
  a node registered in one is invisible to the other.
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
npm run build      # tsup: one entry per node + the root barrel
npm run lint       # tsc --noEmit
npm run manifests  # validate every manifest, print registry paths
```

## Publishing

npm, OIDC / Trusted Publishing. Ship = bump version → update `CHANGELOG.md` in
the same commit → commit → tag `vX.Y.Z` → push tag → CI publishes. One version
covers every node in the package; say in the changelog which node changed. Then
re-register any manifest that changed, and advance the envelope pin. See the
envelope's `.ai/knowledge/publishing.md`.
