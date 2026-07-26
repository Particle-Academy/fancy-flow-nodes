<?php

declare(strict_types=1);

namespace FancyFlow\Nodes\Laravel;

use FancyFlow\Laravel\Facades\FancyFlow;
use FancyFlow\Nodes\UiEffect\BroadcastUiEffectHost;
use FancyFlow\Nodes\UiEffect\UiEffectExecutor;
use FancyFlow\Nodes\UiEffect\UiEffectHost;
use Illuminate\Contracts\Broadcasting\Broadcaster;
use Illuminate\Support\ServiceProvider;

/**
 * Registers every marketplace node's PHP backend with fancy-flow.
 *
 * Auto-discovered, so `composer require particle-academy/fancy-flow-nodes` is
 * the whole install: each node's executor is bound to its kind id AND to every
 * alias the kind answers to, because a document saved before a rename carries
 * the old string and would otherwise resolve to nothing.
 *
 * ## What this does NOT bind
 *
 * A node's **host** — the thing that actually reaches the outside world. Those
 * are bound with `bindIf`, so an app that has already bound its own keeps it.
 * Where a node has no sensible default the binding is simply absent and the
 * executor throws on use, which is the correct outcome: a node that cannot do
 * its job must say so, not run and report success.
 */
class FancyFlowNodesServiceProvider extends ServiceProvider
{
    /**
     * Kind id => executor, and the aliases each kind still answers to.
     *
     * @var array<class-string, array{kind: string, aliases: list<string>}>
     */
    private const NODES = [
        UiEffectExecutor::class => [
            'kind' => '@particle-academy/ui_effect',
            'aliases' => ['ui_effect'],
        ],
    ];

    public function register(): void
    {
        // The default transport for ui_effect: broadcast it and let the browser
        // apply it with the same DOM host an in-browser run uses. bindIf, so an
        // app with its own transport (SSE, a long-poll relay) keeps it.
        $this->app->bindIf(
            UiEffectHost::class,
            fn ($app) => new BroadcastUiEffectHost($app->make(Broadcaster::class)),
        );
    }

    public function boot(): void
    {
        // fancy-flow's Laravel layer is optional to this package's core — the
        // executors are plain PHP and usable without it.
        if (! class_exists(FancyFlow::class)) {
            return;
        }

        foreach (self::NODES as $executor => $node) {
            foreach ([$node['kind'], ...$node['aliases']] as $id) {
                FancyFlow::extend($id, $executor);
            }
        }
    }
}
