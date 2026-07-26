/**
 * `@particle-academy/fancy-flow-nodes` — the first-party node marketplace.
 *
 * Every published node lives in this one package, so `fancy-cli add node
 * <anything>` resolves to the same install rather than a repo and an npm
 * package per node. Each node also has its own subpath, which is what you
 * usually want:
 *
 * ```ts
 * import { uiEffectKind } from "@particle-academy/fancy-flow-nodes/ui-effect";
 * ```
 *
 * Importing from the subpath pulls in only that node. Importing from here pulls
 * in all of them — convenient for an app that wants the whole palette, wasteful
 * for one that wants a single node.
 */

import { registerNodeKind, type NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { uiEffectKind } from "../nodes/ui-effect";

/** Every node this package publishes, in palette order. */
export const flowNodeKinds: NodeKindDefinition[] = [uiEffectKind];

/**
 * Register every node in this package.
 *
 * Returns an unregister function, mirroring the engine's own capability
 * registrations — a test that installs the palette should be able to take it
 * back out.
 */
export function registerFlowNodes(): () => void {
  const undo = flowNodeKinds.map((kind) => registerNodeKind(kind));

  return () => undo.forEach((fn) => fn());
}

export * from "../nodes/ui-effect";
