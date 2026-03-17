# Using the Workflow Outside Cursor

> **Recommendation: use Cursor.**
> This workflow is distributed as a native Cursor plugin. In Cursor, slash commands, hooks, and sub-agents work automatically with no manual setup. When the plugin reaches the Cursor Marketplace, updates will be delivered automatically inside Cursor — you will never need to touch a terminal.
>
> Until the plugin is published to the Marketplace, update by pulling the repository and re-running the install script. The script is idempotent and safe to run any number of times:
>
> ```bash
> git pull
> ./scripts/install-plugin-local.sh
> ```

If you cannot use Cursor, this page explains how to adapt the workflow for other AI tools.

The core methodology — brainstorm, plan, work-plan, review, commit — is tool-agnostic. Every command is a plain markdown file with a structured prompt. These files work in any tool that accepts long-form prompts.

---

## Feature comparison

| Feature | Cursor | Claude Code | Windsurf | VS Code + Copilot |
|---------|--------|-------------|----------|-------------------|
| Native slash commands | ✅ | ✅ | ❌ | ❌ |
| Rules / global context | ✅ | ✅ via `CLAUDE.md` | ✅ via `.windsurfrules` | ✅ via `copilot-instructions.md` |
| Hooks (automation guardrails) | ✅ | ❌ | ❌ | ❌ |
| Sub-agents (parallel research) | ✅ | Partial | ❌ | ❌ |
| Auto-updates | ✅ Marketplace | Manual | Manual | Manual |

---

## Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is the closest alternative to Cursor for this workflow. It uses the same slash command mechanism: markdown files in `.claude/commands/` are invoked with `/command-name`.

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. In your project, create the commands directory and copy the workflow commands:

   ```bash
   mkdir -p .claude/commands
   cp /path/to/Psters_AI_Workflow/plugins/psters-ai-workflow/commands/*.md .claude/commands/
   ```

3. Create or append to `CLAUDE.md` in your project root to load the workflow rules as global context. Copy the content of the rules you want — start with `context7-documentation.mdc` and `commits.mdc`:

   ```bash
   # Create CLAUDE.md if it does not exist
   touch CLAUDE.md
   ```

   Then paste the content of relevant rule files from `plugins/psters-ai-workflow/rules/` into `CLAUDE.md`.

### Usage

Run the workflow in Claude Code exactly as in Cursor:

```
/brainstorm add user authentication with JWT
/plan
/work-plan
/review
/commit-changes
```

### What works in Claude Code

- **All slash commands work natively.** The command format is identical to Cursor.
- **Rules work** via `CLAUDE.md` (global context file read automatically).
- **Hooks do not work.** Claude Code has no hook system. You apply documentation discipline manually.
- **Sub-agents are partial.** Commands that spawn multiple research agents will run them sequentially in the conversation rather than in parallel.

### Keeping commands up to date

```bash
cd Psters_AI_Workflow && git pull
cp plugins/psters-ai-workflow/commands/*.md /path/to/your-project/.claude/commands/
```

---

## Windsurf

[Windsurf](https://codeium.com/windsurf) (by Codeium) does not have a native slash command system equivalent to Cursor. Commands are used as manual prompts in Cascade chat.

### Setup

Copy the rules file content into `.windsurfrules` at the root of your project:

```bash
touch .windsurfrules
# Paste the content of the rules you want from:
# plugins/psters-ai-workflow/rules/
```

### Usage

1. Open the command file for the step you want. They are in:
   `plugins/psters-ai-workflow/commands/<command>.md`

2. Copy the file content and paste it into the Cascade chat as your prompt.

3. Follow the output and move to the next step.

### Recommended sequence

```
[Paste brainstorm.md content] -> [Paste plan.md content] -> [Paste work-plan.md content] -> [Paste review.md content] -> [Paste commit-changes.md content]
```

---

## VS Code + GitHub Copilot

GitHub Copilot does not support custom slash commands equivalent to Cursor. Commands are used as manual prompts in Copilot Chat.

### Setup

Add workflow context as custom instructions:

1. Create `.github/copilot-instructions.md` in your project.
2. Paste the contents of the rules you want from `plugins/psters-ai-workflow/rules/` into that file.

### Usage

1. Open the command file for the step: `plugins/psters-ai-workflow/commands/<command>.md`
2. Copy the content and paste it into Copilot Chat.
3. Follow the output and continue to the next step.

The methodology applies exactly the same way — the slash command system is just a convenience layer.

---

## Any other AI tool

For any AI tool that accepts long-form prompts:

1. Open the command file for the step you want: `plugins/psters-ai-workflow/commands/<command>.md`
2. Copy its full content and paste it as your prompt.
3. Follow the output and repeat for the next step.

The workflow sequence does not depend on the tool:

```
brainstorm -> plan -> work-plan (per phase) -> review -> commit-changes
```

---

## Summary

The fastest path is Cursor. If you cannot use Cursor, **Claude Code is the best alternative** — it preserves the slash command experience with minimal setup. For all other tools, use the command files as manual prompts: the methodology still applies, only the convenience layer changes.
