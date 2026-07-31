# @particle-academy/git_repo

Hosted repository metadata — default branch, visibility, URLs.

One of the **hosted-provider** nodes in [`fancy-flow-nodes`](../../README.md),
alongside the `git_pr_*` family. They wrap
[`@particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-js) /
[`particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-php),
whose provider contract is **neutral across GitHub, GitLab and Bitbucket** — so
the same graph runs against any of them.

```bash
npx fancy-cli@latest add node @particle-academy/git_repo
```

## Why it exists

Every `git_pr_*` node takes a target branch, and hardcoding `"main"` in a graph
is how a workflow silently targets the wrong branch on a repository that uses
`master`, `develop` or `trunk`. Nothing fails; the pull request just opens
against a branch nobody merges.

This is the node that answers it, so a graph can **read** the default branch
instead of assuming it:

```
git_repo ──▶ git_pr_open (targetBranch = {{ $.defaultBranch }})
```

## Host wiring

Declares the **`gitProvider`** capability — the same registry the `git_pr_*`
nodes use, so a graph that already opens pull requests needs no extra setup.

```ts
import { registerGitHost } from "@/components/fancy/flow-nodes/git-repo/js/provider";
import { ProviderRegistry } from "@particle-academy/fancy-git";
import { githubProvider } from "@particle-academy/fancy-git-github";

registerGitHost({
  registry: new ProviderRegistry().register(githubProvider({ token: env.GITHUB_TOKEN })),
});
```

Read-only and `idempotent` — safe to replay.
