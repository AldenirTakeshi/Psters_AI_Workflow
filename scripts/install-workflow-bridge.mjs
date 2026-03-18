#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const PLUGIN_ROOT = path.join(REPO_ROOT, "plugins", "psters-ai-workflow");
const COMMANDS_DIR = path.join(PLUGIN_ROOT, "commands");
const RULES_DIR = path.join(PLUGIN_ROOT, "rules");
const CURSOR_INSTALL_SCRIPT = path.join(REPO_ROOT, "scripts", "install-plugin-local.sh");

const DEFAULT_CLAUDE_RULES = [
  "commits.mdc",
  "context7-documentation.mdc",
  "operational-guardrails.mdc",
  "agent-namespace.mdc"
];

const RULE_BLOCK_START = "<!-- PSTERS-WORKFLOW-RULES:START -->";
const RULE_BLOCK_END = "<!-- PSTERS-WORKFLOW-RULES:END -->";

function printHelp() {
  console.log(`Usage:
  node scripts/install-workflow-bridge.mjs [--to cursor|claude|all] [--project <path>] [--rules <comma-separated-rule-files>]

Examples:
  node scripts/install-workflow-bridge.mjs --to cursor
  node scripts/install-workflow-bridge.mjs --to claude --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to all --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to claude --rules commits.mdc,operational-guardrails.mdc
`);
}

function parseArgs(argv) {
  const args = {
    to: "cursor",
    project: process.cwd(),
    rules: DEFAULT_CLAUDE_RULES
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }
    if (token === "--to") {
      args.to = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--project") {
      args.project = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--rules") {
      const raw = argv[i + 1] || "";
      args.rules = raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (!["cursor", "claude", "all"].includes(args.to)) {
    throw new Error(`Invalid --to value: ${args.to}`);
  }
  if (!args.project) {
    throw new Error("Missing --project value");
  }
  return args;
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

async function copyCommandFiles(claudeCommandsDir) {
  const entries = await fs.readdir(COMMANDS_DIR, { withFileTypes: true });
  const copied = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }
    const src = path.join(COMMANDS_DIR, entry.name);
    const dst = path.join(claudeCommandsDir, entry.name);
    await fs.copyFile(src, dst);
    copied.push(entry.name);
  }
  return copied.sort();
}

function stripFrontmatter(text) {
  if (!text.startsWith("---\n")) {
    return text.trim();
  }
  const closing = text.indexOf("\n---\n", 4);
  if (closing === -1) {
    return text.trim();
  }
  return text.slice(closing + 5).trim();
}

async function buildRuleBlock(ruleFiles) {
  const sections = [];
  for (const fileName of ruleFiles) {
    const rulePath = path.join(RULES_DIR, fileName);
    let content;
    try {
      content = await fs.readFile(rulePath, "utf8");
    } catch {
      throw new Error(`Rule file not found: ${rulePath}`);
    }
    sections.push(`## Rule: ${fileName}\n\n${stripFrontmatter(content)}`);
  }

  return `${RULE_BLOCK_START}
# Psters Workflow Rules (managed block)

Do not edit manually. Re-run \`install-workflow-bridge.mjs\` to refresh.

${sections.join("\n\n---\n\n")}
${RULE_BLOCK_END}`;
}

function upsertManagedRuleBlock(existing, block) {
  const start = existing.indexOf(RULE_BLOCK_START);
  const end = existing.indexOf(RULE_BLOCK_END);
  if (start !== -1 && end !== -1 && end > start) {
    const before = existing.slice(0, start).trimEnd();
    const after = existing.slice(end + RULE_BLOCK_END.length).trimStart();
    return `${before}\n\n${block}\n\n${after}`.trim() + "\n";
  }
  if (existing.trim().length === 0) {
    return `${block}\n`;
  }
  return `${existing.trim()}\n\n${block}\n`;
}

async function installClaude(projectPath, ruleFiles) {
  const claudeDir = path.join(projectPath, ".claude");
  const claudeCommandsDir = path.join(claudeDir, "commands");
  const claudeMdPath = path.join(projectPath, "CLAUDE.md");

  await ensureDir(claudeCommandsDir);
  const copied = await copyCommandFiles(claudeCommandsDir);

  const block = await buildRuleBlock(ruleFiles);
  let existing = "";
  try {
    existing = await fs.readFile(claudeMdPath, "utf8");
  } catch {
    existing = "";
  }
  const updated = upsertManagedRuleBlock(existing, block);
  await fs.writeFile(claudeMdPath, updated, "utf8");

  return {
    projectPath,
    copiedCommands: copied.length,
    commandNames: copied,
    claudeMdPath
  };
}

function installCursor() {
  const result = spawnSync("bash", [CURSOR_INSTALL_SCRIPT], {
    cwd: REPO_ROOT,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    throw new Error("Cursor local plugin installation failed");
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectPath = path.resolve(args.project);

  const runCursor = args.to === "cursor" || args.to === "all";
  const runClaude = args.to === "claude" || args.to === "all";

  if (runCursor) {
    installCursor();
  }

  if (runClaude) {
    const result = await installClaude(projectPath, args.rules);
    console.log(`Installed workflow commands to: ${path.join(projectPath, ".claude", "commands")}`);
    console.log(`Updated managed rule block in: ${result.claudeMdPath}`);
    console.log(`Commands copied (${result.copiedCommands}): ${result.commandNames.join(", ")}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
