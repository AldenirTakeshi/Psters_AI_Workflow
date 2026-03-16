---
name: work-plan
description: >
  Execute a plan phase from docs/plans/. Reads existing docs first, executes tasks directly from the plan,
  builds, then updates documentation. No intermediate planning. No tests.
argument-hint: "[path to plan file] [optional: Phase N]"
---

# Step 3 — Execute One Planned Phase

Use this command to execute one phase from `docs/plans/` with full discipline: read docs first, implement, build, and update docs.

## Documentation Intent (Read This First)

Docs updated during `/work-plan` must become reliable implementation memory for future phases and future AI runs.

Do not write generic summaries. Document:

- what is already implemented in code after this phase,
- what remains planned in later phases,
- where to edit safely next time,
- and which constraints must not be violated.

## ⛔ MANDATORY WORKFLOW — NEVER SKIP ANY STEP

You MUST execute steps 1 through 5 IN ORDER. Do NOT jump to implementation.
Your FIRST action must be reading the plan file and documentation (Step 1), NOT editing code.
If you skip Step 1 or Step 4, the workflow is BROKEN.

---

## Input

<plan_input> #$ARGUMENTS </plan_input>

If empty or not pointing to a plan file, ask: "Which plan file? (e.g. `docs/plans/20260312-feat-xyz-plan.md`)"

---

## Step 1: Load Context (BLOCKING — must complete before any code changes)

**Your first tool calls MUST be Read calls. Do NOT start implementing.**

1. **Read the plan file** fully.

2. **Identify the target phase** — first ⬜ Pending phase, or the one specified by the user. If the argument names a phase number (e.g. "Phase 2"), start at that phase.

3. **Read existing documentation (REQUIRED — use Read tool NOW):**
   - `docs/solutions/patterns/critical-patterns.md` — ALWAYS read this first if it exists
   - `docs/modules/<module>.md` — if the phase touches a backend module
   - `docs/features/<feature>.md` — if the phase touches a frontend feature
   - `docs/lambdas/<repo>.md` — if the phase touches a Lambda repo
   - Relevant `docs/solutions/` entries — search by feature keywords for known patterns and gotchas
   - **If any expected doc file is missing:** create it immediately with a useful baseline. Minimum sections:
     - `Purpose`
     - `Source of Truth Files`
     - `Current Implementation Snapshot`
     - `Phase Scope (Current Plan)` with explicit `planned` markers
     - `Invariants and Gotchas`
     - `Safe Change Checklist for Future AI Work`
     - `Related Plan and Docs`

4. **Present summary to user:** Phase name, objective, task count. Get confirmation to proceed.

5. **Ticket number:** If not in plan frontmatter, ask once: "Do you have a ticket number (TICKET-XXXX) for commit messages?"

6. **Create TodoWrite** task list directly from the plan phase's numbered tasks (in dependency order).

---

## Step 2: Execute

For each task in the phase:

- Mark in progress in TodoWrite.
- Read the referenced files. Follow project rules and existing patterns from docs read in Step 1.
- Implement the task.
- Mark task completed in TodoWrite.

### ⚠️ CRITICAL: TypeORM Migration Atomic Chain (when applicable)

When a task generates a TypeORM migration, you **MUST** execute this entire chain as a **blocking, unbreakable sequence** before touching any other task. Skipping or deferring causes schema drift that breaks production.

```
1. GENERATE    → npm run typeorm:generate -- src/database/migrations/MigrationName
2. DRIFT-CHECK → Run schema-drift-detector agent on the new file. Fix ANY unrelated table/column changes.
3. RUN LOCALLY → cd backend && npm run typeorm:run  (or npm run dev:migrate for Docker)
4. VERIFY      → If typeorm:run fails → STOP. Fix the issue. Do NOT continue.
```

**Why this is critical:** `typeorm:generate` compares entities against the LOCAL database schema. If a previous migration wasn't run, the next generate will see a stale schema and produce a migration containing drift (duplicate changes from the unrun migration). This creates migrations that fail in production with "table already exists" or "type already exists" errors.

**If you need to generate a second migration in the same session**, the first one MUST be run on the local DB first. No exceptions.

**Production deployment:** Remind the user to use project-specific migration scripts that block schema dumps before touching production.

### Built-in capabilities (use as needed during execution):

- **AWS CLI:** Run `aws sso login --profile <aws-profile>` before any AWS command when applicable. Never use CDK/IAC unless project-specific rules allow.
- **Database access:** Load DB vars from `backend/.env` (or project-specific env) for psql queries when applicable. Never display credentials.
- **Context7:** Use the Context7 MCP (`resolve-library-id` then `query-docs`) before implementing with external libraries.

### After all tasks:

1. **Build** — `npm run build` in every affected repo. Fix ALL errors before continuing.
2. **Update plan file:**
   - Mark the phase as `✅ Completed` in the Implementation Plan table.
   - In the `## ✅ Master Checklist`, mark each completed task: `- [ ]` → `- [x]`.

---

## Step 3: Quality Review

**Only run if the phase changed 5+ files or touched multiple repos.** Otherwise skip to Step 4.

If triggered, spawn review agents **in parallel** using the Task tool (`subagent_type: generalPurpose`). For each, tell the subagent to read its agent file and review the implementation. Select agents based on what was changed:

- `frontend/` or Angular touched → `angular-reviewer` (`agents/review/angular-reviewer.md`)
- `backend/` or NestJS touched → `nestjs-reviewer` (`agents/review/nestjs-reviewer.md`)
- Lambda repos touched → `lambda-reviewer` (`agents/review/lambda-reviewer.md`)
- TypeORM migration created → `data-integrity-guardian` + `schema-drift-detector`
- Auth, secrets touched → `security-sentinel`
- Always (when review runs) → `code-simplicity-reviewer`

Address **critical** findings before finishing. Informational findings are noted but don't block.

---

## Step 4: Documentation Maintenance (MANDATORY — never skip)

**This step is MANDATORY even for small changes.** Run applicable steps **in parallel** using the Task tool (`subagent_type: generalPurpose`).

**1. Doc Shepherd — ALWAYS run (no exceptions):**
Spawn `doc-shepherd` (`agents/docs/doc-shepherd.md`) with:
- `diff` — git diff of the phase's implementation
- `changed_files` — list of modified/created/deleted files
- `work_summary` — phase name + brief description

It fixes stale references in existing docs and reports contradictions.

**2. Backend module doc — if module substantially changed:**
If new endpoints, entities, or business rules were added to a NestJS module, spawn `backend-module-doc-writer` (`agents/docs/backend-module-doc-writer.md`) to update `docs/modules/<module>.md`.
If `docs/modules/<module>.md` does not exist, create it first, then populate it.

**3. Frontend feature doc — if feature substantially changed:**
If new components, routes, or services were added, spawn `frontend-feature-doc-writer` (`agents/docs/frontend-feature-doc-writer.md`) to update `docs/features/<feature>.md`.
If `docs/features/<feature>.md` does not exist, create it first, then populate it.

**4. Lambda doc — if Lambda repos touched:**
Spawn `lambda-doc-writer` (`agents/docs/lambda-doc-writer.md`) for each Lambda repo modified. Write to `docs/lambdas/<repo>.md`. Remind user to deploy.
If `docs/lambdas/<repo>.md` does not exist, create it first, then populate it.

**5. Pattern extraction — if a new reusable pattern was established:**
Spawn `pattern-extractor` (`agents/docs/pattern-extractor.md`) with the diff and context. If it returns a pattern (not `NO_PATTERN_FOUND`), write to `docs/solutions/patterns/<category>/<filename>.md`.
If the target patterns folder/file does not exist, create it.

### Documentation Quality Gate (BLOCKING)

Before Step 5, each updated/created doc must pass all checks:

1. **Phase-aware clarity**
   - Distinguish what this phase completed vs what remains for later phases.
   - Never mark future phase scope as implemented.

2. **Concrete references**
   - Cite exact file paths, endpoints, DTO/entity names, and service methods changed in this phase.
   - Avoid generic statements without code anchors.

3. **Future execution support**
   - Include invariants, gotchas, and a safe next-change checklist.
   - Include dependencies between backend/frontend/lambda if relevant.

4. **Plan synchronization quality**
   - Plan status table and master checklist updated accurately.
   - If phase only partial, mark exactly what is pending instead of forcing completion.

5. **Consistency with critical patterns**
   - No contradictions with `docs/solutions/patterns/critical-patterns.md` (if it exists).
   - Terminology consistent across `docs/modules`, `docs/features`, `docs/lambdas`, and plan.

6. **Signal over noise**
   - No filler prose; keep actionable context for future implementation/review.

---

## Step 5: Finish

Summarize: what was implemented, files changed, any deferred items.

Include a dedicated **Documentation updates** subsection:

- docs files updated/created
- what high-value operational knowledge was added
- checklist/phase sync status
- any explicit doc debt left for next phase

Suggest next steps:
- **Next phase** → continue with `/work-plan [same plan path] Phase N+1`
- **Commit** with ticket number
- **`/review`** for full PR review (if all phases done or before merge)
- **`/compound`** if a non-trivial bug was fixed during the phase
- **Lambda deploy** reminder if Lambda repos were touched

---

## Conventions

**Patterns:** kebab-case files, PascalCase classes; consistent error capture; TypeORM CLI for migrations when applicable; English text.

**Commits:** `[TICKET-XXXX] <emoji> <type>(<scope>): <subject>` per `rules/commits.mdc`.

**Lambda deploy:** Run from Lambda repo root after SSO login. Use project deploy scripts only.

**No tests:** Do not write or run unit tests or E2E tests unless project rules require it.

**Protected:** Never delete `docs/plans/`, `docs/solutions/`, `docs/lambdas/`, `docs/modules/`, `docs/features/`, `docs/decisions/`, `docs/work-plans/`.
