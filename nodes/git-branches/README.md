# @particle-academy/git_branches

List a working copy's branches and report which one is checked out.

One of the **local working-copy** nodes in [`fancy-flow-nodes`](../../README.md).
They drive [`@particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-js) /
[`particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-php)
against a checkout on disk — distinct from the `git_pr_*` nodes, which talk to a
hosted provider over its API.

```bash
npx fancy-cli@latest add node @particle-academy/git_branches
```

## Host wiring

This node declares the **`gitRepository`** capability. Register a host once,
before the first run:

```ts
import { registerGitRepoHost } from "@/components/fancy/flow-nodes/git-branches/js/repo";
import { GitRepository } from "@particle-academy/fancy-git";

registerGitRepoHost({
  resolve: (name) => new GitRepository(workspacePathFor(name)),
});
```

`repo` in the node config is a **name the host resolves, never a path**. A graph
that carried a filesystem path would let its author point a node anywhere the
worker can reach; the host decides what a name maps to, and returning `null`
refuses outright.

## Output

`branches`, `count`, `names`, and `current` — the checked-out branch lifted out,
because almost every workflow that lists branches then asks which one it is on,
and finding it otherwise means scanning for `current: true`.

Remote branches are excluded unless `includeRemote` is on.
