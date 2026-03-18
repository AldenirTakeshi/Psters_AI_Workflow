import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const REPO_ROOT = process.cwd();
const HOOKS_DIR = join(REPO_ROOT, "plugins", "psters-ai-workflow", "hooks");

function runHook(scriptName, payload, envOverrides = {}) {
  return spawnSync("node", [join(HOOKS_DIR, scriptName)], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: {
      ...process.env,
      ...envOverrides
    }
  });
}

test("track-edit stores per-session state with safe file path handling", () => {
  const pluginRoot = mkdtempSync(join(tmpdir(), "psters-hook-track-"));
  try {
    const result = runHook(
      "track-edit.mjs",
      {
        session_id: "session-1",
        file_path: "docs/architecture.md"
      },
      { CURSOR_PLUGIN_ROOT: pluginRoot }
    );
    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "{}");

    const statePath = join(pluginRoot, ".cursor", "hooks", "state", "psters-ai-workflow.json");
    const saved = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(saved.sessions["session-1"].docEdits, 1);
    assert.equal(saved.sessions["session-1"].codeEdits, 0);

    // Path traversal payload should be sanitized.
    const traversal = runHook(
      "track-edit.mjs",
      {
        session_id: "session-1",
        file_path: "../outside.md"
      },
      { CURSOR_PLUGIN_ROOT: pluginRoot }
    );
    assert.equal(traversal.status, 0);
    const savedAfter = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(savedAfter.sessions["session-1"].touched.includes("../outside.md"), false);
  } finally {
    rmSync(pluginRoot, { recursive: true, force: true });
  }
});

test("doc-guard-stop emits follow-up message only when docs were skipped", () => {
  const pluginRoot = mkdtempSync(join(tmpdir(), "psters-hook-stop-"));
  try {
    runHook(
      "track-edit.mjs",
      { session_id: "session-2", file_path: "backend/src/app.ts" },
      { CURSOR_PLUGIN_ROOT: pluginRoot }
    );

    const stopResult = runHook(
      "doc-guard-stop.mjs",
      { session_id: "session-2" },
      { CURSOR_PLUGIN_ROOT: pluginRoot }
    );
    assert.equal(stopResult.status, 0);
    const output = JSON.parse(stopResult.stdout);
    assert.match(output.followup_message, /Documentation guard/);
  } finally {
    rmSync(pluginRoot, { recursive: true, force: true });
  }
});

test("commit-convention-reminder warns when ticket prefix is missing", () => {
  const missing = runHook("commit-convention-reminder.mjs", {
    command: 'git commit -m "fix: update hooks"'
  });
  assert.equal(missing.status, 0);
  assert.match(missing.stderr, /Commit reminder/);

  const withTicket = runHook("commit-convention-reminder.mjs", {
    command: 'git commit -m "[TICKET-1234] 🐛 fix(hooks): enforce guardrails"'
  });
  assert.equal(withTicket.status, 0);
  assert.equal(withTicket.stderr.trim(), "");
});

test("migration-atomic-reminder warns on typeorm generate command", () => {
  const result = runHook("migration-atomic-reminder.mjs", {
    command: "npm run typeorm:generate -- src/database/migrations/NewMigration"
  });
  assert.equal(result.status, 0);
  assert.match(result.stderr, /TypeORM atomic chain reminder/);
});

test("telemetry writes events only when opt-in is enabled", () => {
  const pluginRoot = mkdtempSync(join(tmpdir(), "psters-hook-telemetry-"));
  try {
    runHook(
      "track-edit.mjs",
      { session_id: "session-telemetry", file_path: "docs/test.md" },
      {
        CURSOR_PLUGIN_ROOT: pluginRoot,
        PSTERS_WORKFLOW_TELEMETRY_OPT_IN: "true"
      }
    );
    const telemetryPath = join(
      pluginRoot,
      ".cursor",
      "hooks",
      "state",
      "psters-ai-workflow-telemetry.jsonl"
    );
    const telemetry = readFileSync(telemetryPath, "utf8");
    assert.match(telemetry, /afterFileEdit/);
  } finally {
    rmSync(pluginRoot, { recursive: true, force: true });
  }
});

