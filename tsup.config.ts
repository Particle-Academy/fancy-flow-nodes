import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

/**
 * One entry per node, plus a root barrel.
 *
 * The per-node subpaths are the point: a consumer installing this package for
 * ONE node should bundle one node. The root entry is the convenience door for
 * an app that wants the whole palette.
 */
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "ui-effect": "nodes/ui-effect/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  // The engine is the consumer's, not ours. Bundling it would give an app two
  // copies of the kind registry, and a node registered in one would be
  // invisible to the other.
  external: ["@particle-academy/fancy-flow"],
  async onSuccess() {
    // Optional effect classes, shipped beside the JS rather than injected —
    // importing CSS from a library entry forces a bundler config on everyone.
    mkdirSync(join("dist", "ui-effect"), { recursive: true });
    copyFileSync(join("nodes", "ui-effect", "effects.css"), join("dist", "ui-effect", "effects.css"));
  },
});
