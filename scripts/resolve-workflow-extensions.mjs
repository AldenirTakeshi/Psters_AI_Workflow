#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const extensionsPath = path.join(
  root,
  "plugins",
  "psters-ai-workflow",
  "extensions",
  "extensions.json"
);

function loadExtensions() {
  const raw = readFileSync(extensionsPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.extensions) ? parsed.extensions : [];
}

function main() {
  const hookPoint = process.argv[2];
  if (!hookPoint) {
    process.stderr.write("Usage: node scripts/resolve-workflow-extensions.mjs <hook-point>\n");
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

