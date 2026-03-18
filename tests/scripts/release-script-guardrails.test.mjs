import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("release script enforces plugin and marketplace version drift checks", () => {
  const script = readFileSync(join(process.cwd(), "scripts", "release-plugin.sh"), "utf8");

  assert.match(script, /PLUGIN_JSON=/);
  assert.match(script, /Checking plugin version/);
  assert.match(script, /Plugin version mismatch:/);
  assert.match(script, /Version drift detected:/);
});

