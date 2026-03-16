---
name: review
description: Multi-agent code review. Runs contextual review agents based on what was changed. No compound-engineering.local.md dependency.
argument-hint: "[PR number, branch name, or path]"
---

# Step 4 — Review and Validate Changes

Use this command to run a structured multi-agent review after implementation, then fix findings and re-run until the change is ready.

## Target

<review_target> #$ARGUMENTS </review_target>

Determine: PR (number/URL), branch name, or current branch. Fetch diff and file list:
- PR: `gh pr view <number>` + `gh pr diff <number>`
- Branch: `git diff main...<branch> --name-only` + `git diff main...<branch>`

## Protected Artifacts

Never recommend deleting or ignoring `docs/plans/*.md` or `docs/solutions/*.md`. Discard any agent finding that suggests removing these.

## Run Review Agents

First inspect which repos/files were changed. Then spawn all applicable review agents **in parallel** using the Task tool (`subagent_type: generalPurpose`). For each, tell the subagent to read its agent file and review the provided diff + file list.

Select agents based on what changed:

- `frontend/` or Angular touched → `angular-reviewer` (`agents/review/angular-reviewer.md`) + `julik-frontend-races-reviewer` (`agents/review/julik-frontend-races-reviewer.md`)
- `backend/` or NestJS touched → `nestjs-reviewer` (`agents/review/nestjs-reviewer.md`)
- `*-lambda/` or `*-processor/` touched → `lambda-reviewer` (`agents/review/lambda-reviewer.md`)
- TypeORM migration created or entity changed → `data-integrity-guardian` (`agents/review/data-integrity-guardian.md`) + `schema-drift-detector` (`agents/review/schema-drift-detector.md`)
- Auth, secrets, S3, or file upload touched → `security-sentinel` (`agents/review/security-sentinel.md`)
- Always → `kieran-typescript-reviewer` (`agents/review/kieran-typescript-reviewer.md`) + `code-simplicity-reviewer` (`agents/review/code-simplicity-reviewer.md`) + `architecture-strategist` (`agents/review/architecture-strategist.md`) + `learnings-researcher` (`agents/research/learnings-researcher.md`)

Each Task tool call must include the full diff content and changed file list in the prompt.

## Synthesize

Merge findings; remove duplicates; prioritize by severity (critical → warning → informational). Present:
1. **Summary** — what changed and scope
2. **Critical issues** — must fix before merge
3. **Recommendations** — should fix
4. **Informational** — optional improvements
