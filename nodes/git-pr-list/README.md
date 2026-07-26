# @particle-academy/git_pr_list

List a repository's pull requests, branching on whether any matched.

One of the **PR-lifecycle** nodes in [`fancy-flow-nodes`](../../README.md). They wrap
[`fancy-git-js`](https://github.com/Particle-Academy/fancy-git-js) /
[`fancy-git-php`](https://github.com/Particle-Academy/fancy-git-php), whose provider contract is
**neutral across GitHub, GitLab and Bitbucket** — so the same graph runs against any of them.

```bash
npx fancy-cli@latest add node @particle-academy/git_pr_list
```

## Config

`state` (`open` / `merged` / `closed` / `draft` / `any`) · `limit` (default 20)

Leave `owner` / `repo` empty to fall back to the host's `defaultRepo`.

## Ports

`found` — the reviews, their `count`, and a `nextCursor`.
`none` — nothing matched.

Two ports rather than one because "no open PRs" is a decision in nearly every workflow that asks, and a downstream count check is one somebody forgets to write.

## Wiring

The node carries **no credentials** and must not invent any, so a host hands it a provider
registry. Once, at boot:

```ts
import { registerGitHost } from "@/components/fancy/flow-nodes/git-pr-list/js/provider";
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
never read the pull requests a decision depended on.

## Replay

`sideEffects: `none``. Read-only and safe to replay.
