#!/usr/bin/env node
/**
 * List every node manifest in this repo, validated.
 *
 * `npm run manifests` prints the paths the registry command consumes:
 *
 *   php artisan flow:register-node <path>   # once per line, in px-ui-sandbox
 *
 * It exists because a marketplace repo accumulates nodes, and "which manifests
 * are there, and are they valid" stops being obvious somewhere around the third
 * one. Validation is the engine's own — a repo that disagrees with the runtime
 * about what a valid manifest is would ship packages the runtime then refuses.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { validateNodeManifest } from "@particle-academy/fancy-flow/engine";

const NODES = "nodes";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

let failed = false;

for (const dir of readdirSync(NODES, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;

  const path = join(NODES, dir.name, "fancy-flow.node.json");
  if (!existsSync(path)) {
    console.error(`✗ ${dir.name}: no fancy-flow.node.json`);
    failed = true;
    continue;
  }

  const manifest = JSON.parse(readFileSync(path, "utf8"));
  const { ok, problems } = validateNodeManifest(manifest);

  // The check the engine's validator cannot make: every node in this repo ships
  // in THIS package, and a manifest naming anything else would send `add node`
  // to install something that does not contain the node.
  if (manifest.name !== pkg.name) {
    console.error(`✗ ${dir.name}: name is "${manifest.name}", expected "${pkg.name}"`);
    failed = true;
  }

  // …and that the entry it points at is actually an export of this package.
  const entry = manifest.runtimes?.ts?.entry;
  if (entry && !Object.values(pkg.exports ?? {}).some((e) => JSON.stringify(e).includes(entry.replace("./dist/", "")))) {
    console.error(`✗ ${dir.name}: entry "${entry}" is not reachable through package exports`);
    failed = true;
  }

  for (const problem of problems) {
    console.error(`${problem.level === "error" ? "✗" : "!"} ${dir.name}: ${problem.field}: ${problem.message}`);
  }

  if (!ok) failed = true;
  else console.log(`${failed ? " " : "✓"} ${manifest.kind.padEnd(34)} ${path}`);
}

process.exit(failed ? 1 : 0);
