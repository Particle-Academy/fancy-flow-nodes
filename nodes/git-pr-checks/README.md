# @particle-academy/git_pr_checks

CI state for a revision — the gate a “merge when green” workflow routes on.

One of the **PR-lifecycle** nodes in [`fancy-flow-nodes`](../../README.md). They wrap
[`fancy-git-js`](https://github.com/Particle-Academy/fancy-git-js) /
[`fancy-git-php`](https://github.com/Particle-Academy/fancy-git-php), whose provider contract is
**neutral across GitHub, GitLab and Bitbucket** — so the same graph runs against any of them.

```bash
npx fancy-cli@latest add node @particle-academy/git_pr_checks
```

## Config

`revision` — a SHA or branch. Leave empty to take it from the input; a PR's source branch will do.

Leave `owner` / `repo` empty to fall back to the host's `defaultRepo`.

## Ports

`passing` · `failing` · `pending` · `none`

Four, because collapsing them loses the distinction that matters most: **`pending` is not `failing`**, and **`none` is not `passing`**. Merge them and a workflow either abandons work that was still building, or auto-merges a repository whose CI was never configured.

## Wiring

The node carries **no credentials** and must not invent any, so a host hands it a provider
registry. Once, at boot:

```ts
import { registerGitHost } from "@/components/fancy/flow-nodes/git-pr-checks/js/provider";
import { ProviderRegistry } from "@particle-academy/fancy-git-js";

registerGitHost({
  registry: new ProviderRegistry().register(githubProvider({ token: env.GITHUB_TOKEN })),
  defaultRepo: { provider: "github", owner: "Particle-Academy", name: "fancy-flow" },
});
```

```php
// A Laravel host, in a service provider.
$this->app->bind(GitHost::class, fn () => new GitHost(
    registry: (new ProviderRegistry)->register(new GitHubProvider(config('services.github.token'))),
    defaultRepo: ['provider' => 'github', 'owner' => 'Particle-Academy', 'name' => 'fancy-flow'],
));
```

**With no host bound the node throws.** Deliberately: a node that shrugs is a green run that
never checked whether the build was green.

## Replay

`sideEffects: `none``. Read-only and safe to replay.
