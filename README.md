# @particle-academy/fancy-flow-nodes

The first-party **node marketplace** for [fancy-flow](https://github.com/Particle-Academy/fancy-flow).

Every published node lives here, in one package. `fancy-cli add node <anything>` resolves to the same install — you don't collect a repo and an npm package per node.

```bash
npx fancy-cli@latest add node @particle-academy/ui_effect
```

```ts
// One node — bundles only that node.
import { uiEffectKind } from "@particle-academy/fancy-flow-nodes/ui-effect";
import { registerNodeKind } from "@particle-academy/fancy-flow/engine";

registerNodeKind(uiEffectKind);

// Or the whole palette.
import { registerFlowNodes } from "@particle-academy/fancy-flow-nodes";

registerFlowNodes();
```

Core's 27 builtins ship with the engine and are **not** here — you don't install those.

---

## The nodes

| Kind | Subpath | Runtimes | Replay | What it does |
|---|---|---|---|---|
| `@particle-academy/ui_effect` | `./ui-effect` | ts | unsafe | Change how a live surface looks — class, CSS variable, inline style. |

Each node's own README is next to its source in [`nodes/`](./nodes).

## Layout

```
nodes/<name>/
  fancy-flow.node.json    the manifest the registry serves
  fixtures/*.json         golden fixtures — required to publish
  index.ts                the subpath entry
  kind.ts                 NodeKindDefinition: palette, config schema, ports
  executor.ts             what it does
tests/<name>/             its tests
```

One directory per node, self-contained. `npm run manifests` validates every one of them through the engine's own validator and prints the paths the registry command consumes.

## Adding a node

1. `nodes/<name>/` with a manifest, fixtures, kind and executor.
2. Add its entry to `tsup.config.ts` and its subpath to `package.json` `exports`.
3. Add it to `flowNodeKinds` in `src/index.ts`.
4. `npm run manifests` — it must validate, name **this** package, and point at an entry the package exports. There are tests for all three; they drift silently otherwise.
5. Ship, then register it:
   ```bash
   php artisan flow:register-node nodes/<name>/fancy-flow.node.json   # in px-ui-sandbox
   ```

### What a manifest must be honest about

- `runtimes` — claim only what exists. A node claiming `php` it doesn't implement installs fine on a PHP host and fails at run time, which is exactly what the manifest exists to prevent.
- `sideEffects` — durable runs **retry**. `unsafe-to-replay` is the honest answer for anything that isn't idempotent, even if most of its operations are.
- `capabilities` — what a host must wire before the node can work, checked at author time so an editor can grey it out rather than have a run silently no-op.
- `pausesForHuman` — a parent workflow must be able to reject a child that can pause, without running it.

## Requirements

- `@particle-academy/fancy-flow` >= 0.30.0 (peer)

## License

MIT © Particle Academy
