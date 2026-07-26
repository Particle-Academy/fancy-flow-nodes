# @particle-academy/git_pr_open

Open a pull request from one branch into another.

One of the **PR-lifecycle** nodes in [`fancy-flow-nodes`](../../README.md). They wrap
[`fancy-git-js`](https://github.com/Particle-Academy/fancy-git-js) /
[`fancy-git-php`](https://github.com/Particle-Academy/fancy-git-php), whose provider contract is
**neutral across GitHub, GitLab and Bitbucket** — so the same graph runs against any of them.

```bash
npx fancy-cli@latest add node @particle-academy/git_pr_open
```

## Config

`title` (required) · `body` · `sourceBranch` (required) · `targetBranch` (default `main`) · `draft`

Leave `owner` / `repo` empty to fall back to the host's `defaultRepo`.

## Ports

`out` — the created review, plus its `number` and `url`.

## Wiring

The node carries **no credentials** and must not invent any, so a host hands it a provider
registry. Once, at boot:

```ts
import { registerGitHost } from "@/components/fancy/flow-nodes/git-pr-open/js/provider";
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
never opened the pull request someone was waiting for.

## Replay

`sideEffects: `unsafe-to-replay``. Durable runs retry. A retry after a network blip would open a **second** pull request for the same branch, and nothing downstream would notice — guard it, or scope its retry policy.
