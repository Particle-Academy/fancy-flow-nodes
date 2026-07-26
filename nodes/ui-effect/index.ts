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
 * In a browser that is the whole setup — the node finds the DOM on its own.
 * Anywhere else, register a host that can reach the surface:
 *
 * ```ts
 * registerUiEffectHost({ apply: (effect) => relay.send("ui_effect", effect) });
 * ```
 */

export { uiEffectKind, UI_EFFECT_KIND } from "./kind";
export { uiEffectExecutor } from "./executor";
export { createDomUiEffectHost, type DomUiEffectHostOptions } from "./dom";
export { registerUiEffectHost, getUiEffectHost } from "./host";
export type { UiEffect, UiEffectOp, UiEffectHost } from "./types";
