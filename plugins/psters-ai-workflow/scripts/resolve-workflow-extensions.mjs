#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const pluginRoot = path.resolve(path.dirname(thisFile), "..");
const extensionsPath = path.join(pluginRoot, "extensions", "extensions.json");

function loadExtensions() {
  const raw = readFileSync(extensionsPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.extensions) ? parsed.extensions : [];
}

function main() {
  const hookPoint = process.argv[2];
  if (!hookPoint) {
    process.stderr.write(
      "Usage: node ${CURSOR_PLUGIN_ROOT}/scripts/resolve-workflow-extensions.mjs <hook-point>\n"
    );
    process.exit(1);
  }

  const enabled = loadExtensions().filter(
    (ext) => ext && ext.enabled === true && ext.hookPoint === hookPoint
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        hookPoint,
        count: enabled.length,
        extensions: enabled
      },
      null,
      2
    )}\n`
  );
}

main();

