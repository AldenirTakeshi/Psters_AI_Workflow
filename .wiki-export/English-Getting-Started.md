> Source: `docs/english/getting-started.md`

# Getting Started (10 Minutes)

This guide helps you run the workflow end-to-end for the first time.

## 1) Install plugin locally

1. `./scripts/install-plugin-local.sh`
2. Restart Cursor (or reload window).

**Windows + WSL:** If you ran the script inside WSL but the plugin does not appear in Cursor on Windows, see [Cursor on Windows + WSL](cursor-wsl-windows.md).

## 2) Start with a real task

Use a small but real feature/fix from your backlog.

## 3) Run the command flow

1. `/brainstorm` to define scope, architecture, constraints.
2. `/plan` to create phases and executable tasks.
3. `/work-plan` to execute one phase per chat.
4. `/review` to find risks/regressions and fix them.
5. `/commit-changes` to produce clean, structured commits.

## 4) When to use `/work`

Use `/work` for:

- small fixes
- minor adjustments
- follow-up changes outside a formal plan

`/work` still reads docs first and updates docs as part of its flow.

## 5) `/doc` vs `/compound`

- `/work` and `/work-plan` already update docs by default.
- Use `/doc` when you want to force technical documentation updates by scope.
- Use `/compound` when you want to force a learning artifact (problem/solution or reusable pattern).

## 6) Validate plugin setup

Run:

- `node scripts/validate-template.mjs`
