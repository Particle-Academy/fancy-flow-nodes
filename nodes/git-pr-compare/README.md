# @particle-academy/git_pr_compare

Compare two branches or SHAs — the commits between them, and which way they diverge.

One of the **PR-lifecycle** nodes in [`fancy-flow-nodes`](../../README.md). They wrap
[`@particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-js) /
[`particle-academy/fancy-git`](https://github.com/Particle-Academy/fancy-git-php), whose provider contract is
**neutral across GitHub, GitLab and Bitbucket** — so the same graph runs against any of them.

```bash
npx fancy-cli@latest add node @particle-academy/git_pr_compare
```

## Config

`base` (default `main`) · `head` (required)

Leave `owner` / `repo` empty to fall back to the host's `defaultRepo`.

## Ports

`ahead` — the comparison, with `aheadBy` / `behindBy`.
`same` — nothing to merge.

“0 commits ahead” is the answer that most often should stop a workflow before it opens an empty pull request, so it gets its own port.

## Wiring

The node carries **no credentials** and must not invent any, so a host hands it a provider
registry. Once, at boot:

```ts
import { registerGitHost } from "@/components/fancy/flow-nodes/git-pr-compare/js/provider";
import { ProviderRegistry } from "@particle-academy/fancy-git";

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
never checked whether there was anything to merge.

## Replay

`sideEffects: `none``. Read-only and safe to replay.
