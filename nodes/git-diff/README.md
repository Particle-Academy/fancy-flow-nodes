# @particle-academy/git_diff

Diff a working copy — working tree, staged, or between two revisions.

One of the **local working-copy** nodes in [`fancy-flow-nodes`](../../README.md).
They drive [`@particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-js) /
[`particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-php)
against a checkout on disk — distinct from the `git_pr_*` nodes, which talk to a
hosted provider over its API.

```bash
npx fancy-cli@latest add node @particle-academy/git_diff
```

## Host wiring

This node declares the **`gitRepository`** capability. Register a host once,
before the first run:

```ts
import { registerGitRepoHost } from "@/components/fancy/flow-nodes/git-diff/js/repo";
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
| `changed` | at least one file differs |
| `empty` | nothing differs |

An empty diff is the common case for a scheduled automation, and the one that
must NOT continue into a commit or a pull request — so it gets its own port
rather than an empty value on the same one.
