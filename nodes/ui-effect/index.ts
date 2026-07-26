/**
 * `@particle-academy/ui_effect` — change how a running surface looks.
 *
 * One of the nodes in `@particle-academy/fancy-flow-nodes`. Import from this
 * subpath rather than the package root and you bundle only this node.
 *
 * ```ts
 * import { registerNodeKind } from "@particle-academy/fancy-flow/engine";
 * import { uiEffectKind } from "@particle-academy/fancy-flow-nodes/ui-effect";
 *
 * registerNodeKind(uiEffectKind);   // palette entry + config panel + executor
 * ```
 *
 * This entry carries the **UI and the JS backend**. The PHP backend is the same
 * node's `php/` directory, shipped in the Composer package — a Laravel host
 * installs both: npm for the surface, Composer for the executor.
 *
 * In a browser the JS backend needs no setup — it finds the DOM on its own.
 * Anywhere else, register a host that can reach the surface:
 *
 * ```ts
 * registerUiEffectHost({ apply: (effect) => relay.send("ui_effect", effect) });
 * ```
 */

export { uiEffectKind, UI_EFFECT_KIND } from "./ui/kind";
export { uiEffectExecutor } from "./js/executor";
export { createDomUiEffectHost, type DomUiEffectHostOptions } from "./js/dom";
export { registerUiEffectHost, getUiEffectHost } from "./js/host";
export type { UiEffect, UiEffectOp, UiEffectHost } from "./js/types";
