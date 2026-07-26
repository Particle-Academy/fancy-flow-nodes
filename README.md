# @particle-academy/fancy-flow-nodes

The first-party **node marketplace** for [fancy-flow](https://github.com/Particle-Academy/fancy-flow).

Every node lives here, and `fancy-cli` **copies** one into your project — source you can read, edit and diff, not a dependency in `node_modules`.

```bash
npx fancy-cli@latest add node @particle-academy/ui_effect
```

That writes the node's React surface beside your other Fancy components, and its executor for the backend you run:

```
components/fancy/flow-nodes/ui-effect/ui/kind.ts     the palette entry + config panel
components/fancy/flow-nodes/ui-effect/js/…           the TypeScript executor   (--backend=js)
app/Flow/Nodes/ui-effect/php/…                       the PHP executor          (--backend=php)
```

`--backend` is detected from the project when you omit it; `--backend=none` takes the surface alone, for a project that authors graphs but never runs them. The UI comes down either way, because the editor is React on every host.

```ts
import { uiEffectKind } from "@/components/fancy/flow-nodes/ui-effect/ui/kind";
import { registerNodeKind } from "@particle-academy/fancy-flow/engine";

registerNodeKind(uiEffectKind);
```

Core's 27 builtins ship with the engine and are **not** here — you don't add those.

---

## The nodes

| Kind | Backends | Replay | What it does |
|---|---|---|---|
| `@particle-academy/ui_effect` | js, php | unsafe | Change how a live surface looks — class, CSS variable, inline style. |
| `@particle-academy/git_pr_open` | js, php | unsafe | Open a pull request from one branch into another. |
| `@particle-academy/git_pr_list` | js, php | safe | List pull requests, branching on whether any matched. |
| `@particle-academy/git_pr_get` | js, php | safe | Read one pull request in full. |
| `@particle-academy/git_pr_checks` | js, php | safe | CI state for a revision — passing / failing / pending / none. |
| `@particle-academy/git_pr_compare` | js, php | safe | Compare two refs — what's between them, and which way they diverge. |

The five `git_pr_*` nodes wrap `fancy-git-js` / `fancy-git-php`, whose provider contract is **neutral across GitHub, GitLab and Bitbucket** — the same graph runs against any of them. They carry no credentials; a host registers a provider registry once.

Each node's own README is next to its source in [`nodes/`](./nodes).

## Layout

```
nodes/<name>/
  fancy-flow.node.json    the manifest: `ui` + per-runtime `files`
  fixtures/*.json         golden fixtures — both backends run these
  ui/                     the React kind
  js/                     the TypeScript executor
  php/                    the PHP executor
tests/<name>/             its TS tests
tests/php/                its PHP tests
```

One directory per node, carrying all three parts. `npm run manifests` validates every manifest through the engine's own validator and checks that each declared directory exists.

## Adding a node

1. `nodes/<name>/` with a manifest, fixtures, and `ui/` + `js/` + `php/`.
2. `npm run manifests` — it must validate, and every directory it declares must exist.
3. Register it:
   ```bash
   php artisan flow:register-node nodes/<name>/fancy-flow.node.json   # in px-ui-sandbox
   ```

No build, no version bump, no publish. The files are the node.

### What a manifest must be honest about

- `runtimes` — claim only what exists. A node claiming `php` it doesn't implement installs fine on a PHP host and fails at run time, which is exactly what the manifest exists to prevent.
- `sideEffects` — durable runs **retry**. `unsafe-to-replay` is the honest answer for anything that isn't idempotent, even if most of its operations are.
- `capabilities` — what a host must wire before the node can work, checked at author time so an editor can grey it out rather than have a run silently no-op.
- `pausesForHuman` — a parent workflow must be able to reject a child that can pause, without running it.

## Requirements

- `@particle-academy/fancy-flow` >= 0.32.0 in the consuming project
- `particle-academy/fancy-flow-php` >= 0.9.1 for the PHP backends

## License

MIT © Particle Academy
