# @particle-academy/git_checkout

Switch a working copy to a branch or revision — or propose it for approval.

One of the **local working-copy** nodes in [`fancy-flow-nodes`](../../README.md).
They drive [`@particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-js) /
[`particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-php)
against a checkout on disk — distinct from the `git_pr_*` nodes, which talk to a
hosted provider over its API.

```bash
npx fancy-cli@latest add node @particle-academy/git_checkout
```

## Host wiring

This node declares the **`gitRepository`** capability. Register a host once,
before the first run:

```ts
import { registerGitRepoHost } from "@/components/fancy/flow-nodes/git-checkout/js/repo";
import { GitRepository } from "@particle-academy/fancy-git";

registerGitRepoHost({
  resolve: (name) => new GitRepository(workspacePathFor(name)),
});
```

`repo` in the node config is a **name the host resolves, never a path**. A graph
that carried a filesystem path would let its author point a node anywhere the
worker can reach; the host decides what a name maps to, and returning `null`
refuses outright.

## Ports

| Port | When |
|---|---|
| `done` | the checkout happened |
| `proposed` | `propose` was on — nothing was performed |

## Trust but verify

With `propose` on, `fancy-git` returns an `OperationProposal` and the node routes
it to `proposed` **without touching the working copy**. Agents propose, humans
confirm — moving someone else's working copy under them is exactly the case that
wants a pause. Both test suites assert that a propose performs nothing.

Declared `unsafe-to-replay`: durable runs retry.
