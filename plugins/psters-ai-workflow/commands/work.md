---
name: work
description: >
  Execute free-form work. Reads existing docs, researches context, derives concrete tasks,
  implements, builds, and updates documentation. For plan-driven work use /work-plan.
argument-hint: "[description of what to do, e.g. fix X, improve Y, add Z]"
---

# Execute Unplanned Work (Fast Path)

Use this command for small fixes, minor adjustments, and focused tasks outside formal plans. For phase execution from `docs/plans/`, use `/work-plan`.

## Documentation Intent (Read This First)

Documentation in `docs/` is operational memory for future AI and engineers, not a release note.

Every documentation update must help a future implementation answer quickly:

- Where is the source of truth?
- What is implemented now vs only planned?
- Which invariants/rules cannot be broken?
- Which files/methods must change together?
- What are the known gotchas and safe change steps?

Avoid generic text that could apply to any project.

## ⛔ MANDATORY WORKFLOW — NEVER SKIP ANY STEP

You MUST execute steps 1 through 6 IN ORDER. Do NOT jump to implementation.
Your FIRST action must be reading documentation (Step 1), NOT editing code.
If you skip Step 1 or Step 5, the workflow is BROKEN.

---

## Input

<work_description> #$ARGUMENTS </work_description>

If empty, ask: "What would you like me to work on?"

---

## Step 1: Research (BLOCKING — must complete before any code changes)

**Your first tool calls MUST be Read calls to load documentation. Do NOT start implementing.**

1. If the description is vague, ask one or two clarifying questions first.

2. **Read existing docs (your FIRST action — use Read tool NOW):**
   - `docs/solutions/patterns/critical-patterns.md` — ALWAYS read this first if it exists
   - `docs/modules/<module>.md` — if touching a backend module
   - `docs/features/<feature>.md` — if touching a frontend feature
   - `docs/lambdas/<repo>.md` — if touching a Lambda repo
   - Search `docs/solutions/` by feature keywords for known gotchas
   - **If any expected doc file is missing:** create it immediately with a useful baseline (not placeholders). Minimum sections:
     - `Purpose` (business scope)
     - `Source of Truth Files` (exact paths)
     - `Current Implementation Snapshot` (what exists now)
     - `Planned/Upcoming Contract` (only if plan exists; clearly marked as planned)
     - `Invariants and Gotchas`
     - `Safe Change Checklist for Future AI Work`
     - `Related Plan and Docs`

3. **Check existing context:**
   - `docs/brainstorms/` — recent brainstorm for this feature?
   - `docs/plans/` — existing plan? If work belongs to a plan phase, suggest `/work-plan` instead.

4. **Spawn research agents (REQUIRED — use Task tool, `subagent_type: generalPurpose`):**
   - **repo-research-analyst** (`agents/research/repo-research-analyst.md`) — maps file paths, existing patterns, rules, existing enums, migration state
   - **learnings-researcher** (`agents/research/learnings-researcher.md`) — surfaces relevant solutions from `docs/solutions/`

   Spawn both **simultaneously**. Wait for both to complete.

5. **Conditional research (spawn in parallel via Task tool if applicable):**
   - Entity changes detected → **migration-impact-planner** (`agents/research/migration-impact-planner.md`)
   - Multi-step or UI flows → **spec-flow-analyzer** (`agents/workflow/spec-flow-analyzer.md`)
   - Security, payments, new tech → **best-practices-researcher**, **framework-docs-researcher**

6. **Present research summary to user:** Before implementing, show:
   - Files that will be changed (from research)
   - Relevant patterns/rules found
   - Any gotchas from `docs/solutions/`
   - Ask: "Do you have a ticket number (TICKET-XXXX) for commit messages?"

   Then proceed to Step 2.

---

## Step 2: Task List

1. Derive a **TodoWrite** task list — concrete, dependency-ordered.
   - Each task: **bold name + file path + sub-bullets** with method names, fields, classes.
   - No vague summaries. Every task must specify *what* to change in *which file*.

2. **Self-validate:** Review every task. Does it have a file path? Does it have specific method names or field names? If not, rewrite it.

### Built-in capabilities (use as needed during execution):

- **AWS CLI:** Run `aws sso login --profile <aws-profile>` before any AWS command when applicable. Never use CDK/IAC unless project-specific rules allow.
- **Database access:** Load DB vars from `backend/.env` (or project-specific env) for psql queries when applicable. Never display credentials.
- **Context7:** Use the Context7 MCP (`resolve-library-id` then `query-docs`) before implementing with external libraries.

---

## Step 3: Execute

For each task:

- Mark in progress in TodoWrite.
- Read referenced files. Follow project rules and patterns from docs read in Step 1.
- Implement.
- Mark completed in TodoWrite.

### ⚠️ CRITICAL: TypeORM Migration Atomic Chain (when applicable)

When a task generates a TypeORM migration, you **MUST** execute this entire chain as a **blocking, unbreakable sequence** before touching any other task. Skipping or deferring causes schema drift that breaks production.

```
1. GENERATE    → npm run typeorm:generate -- src/database/migrations/MigrationName
2. DRIFT-CHECK → Run schema-drift-detector agent on the new file. Fix ANY unrelated table/column changes.
3. RUN LOCALLY → cd backend && npm run typeorm:run  (or npm run dev:migrate for Docker)
4. VERIFY      → If typeorm:run fails → STOP. Fix the issue. Do NOT continue.
```

**Why this is critical:** `typeorm:generate` compares entities against the LOCAL database schema. If a previous migration wasn't run, the next generate will see a stale schema and produce a migration containing drift (duplicate changes from the unrun migration). This creates migrations that fail in production.

**If you need a second migration in the same session**, the first one MUST be run on the local DB first. No exceptions.

**Production deployment:** Remind the user to use project-specific migration scripts that block schema dumps before touching production.

After all tasks:
- **Build** — `npm run build` in every affected repo. Fix ALL errors.

---

## Step 4: Quality Review

**Only run if 5+ files changed or multiple repos touched.** Otherwise skip to Step 5.

If triggered, spawn review agents **in parallel** using the Task tool (`subagent_type: generalPurpose`). For each, tell the subagent to read its agent file and review the implementation. Select agents based on what was changed:

- `frontend/` or Angular touched → `angular-reviewer` (`agents/review/angular-reviewer.md`)
- `backend/` or NestJS touched → `nestjs-reviewer` (`agents/review/nestjs-reviewer.md`)
- Lambda repos touched → `lambda-reviewer` (`agents/review/lambda-reviewer.md`)
- TypeORM migration created → `data-integrity-guardian` + `schema-drift-detector`
- Auth, secrets touched → `security-sentinel`
- Always (when review runs) → `code-simplicity-reviewer`

Address **critical** findings only. Informational findings are noted but don't block.

---

## Step 5: Documentation Maintenance (MANDATORY — never skip)

**This step is MANDATORY even for small changes.** Run applicable steps **in parallel** using the Task tool (`subagent_type: generalPurpose`).

**1. Doc Shepherd — ALWAYS run (no exceptions):**
Spawn `doc-shepherd` (`agents/docs/doc-shepherd.md`) with:
- `diff` — git diff of the implementation
- `changed_files` — list of modified/created/deleted files
- `work_summary` — brief description of what was implemented

**2. Plan sync — if work relates to a plan:**
Read the related plan in `docs/plans/` and update its `## ✅ Master Checklist`: mark completed tasks `- [ ]` → `- [x]`. Update the phase status if all tasks are done.

**3. Backend module doc — if module substantially changed:**
If new endpoints, entities, or business rules were added, spawn `backend-module-doc-writer` (`agents/docs/backend-module-doc-writer.md`) to update `docs/modules/<module>.md`.
If `docs/modules/<module>.md` does not exist, create it first, then populate it.

**4. Frontend feature doc — if feature substantially changed:**
If new components, routes, or services were added, spawn `frontend-feature-doc-writer` (`agents/docs/frontend-feature-doc-writer.md`) to update `docs/features/<feature>.md`.
If `docs/features/<feature>.md` does not exist, create it first, then populate it.

**5. Lambda doc — if Lambda repos touched:**
Update `docs/lambdas/<repo>.md`. Remind user to deploy using project deploy scripts.
If `docs/lambdas/<repo>.md` does not exist, create it first, then populate it.

**6. Pattern extraction — if a new reusable pattern was established:**
Spawn `pattern-extractor` (`agents/docs/pattern-extractor.md`) with the diff and context. If it returns a pattern (not `NO_PATTERN_FOUND`), write to `docs/solutions/patterns/<category>/<filename>.md`.
If the target patterns folder/file does not exist, create it.

### Documentation Quality Gate (BLOCKING)

Before finishing, verify each updated/created doc passes all checks below. If any check fails, revise docs before Step 6:

1. **Specificity**
   - References real files/symbols/paths from this codebase.
   - No vague text like "update service logic" without naming service/method.

2. **State Clarity**
   - Clearly separates `implemented now` vs `planned`.
   - Never implies planned work is already done.

3. **Operational Usefulness**
   - Includes invariants and gotchas that prevent regressions.
   - Includes a safe change checklist with dependency order.

4. **Contract Accuracy**
   - API routes, DTO fields, entity columns, and flow descriptions match current code/plan.
   - If unsure, mark as assumption/open question explicitly.

5. **Cross-Doc Consistency**
   - No contradictions with `docs/solutions/patterns/critical-patterns.md` (if it exists).
   - Module/feature/lambda docs use consistent terminology for the same concept.

6. **No Noise**
   - Avoid high-level filler, retrospectives, or duplicated plan prose.
   - Keep content decision-supportive for future changes.

---

## Step 6: Finish

Summarize: what was implemented, files changed, any caveats.

Include a dedicated **Documentation updates** subsection listing:

- docs files updated/created
- what concrete knowledge was added (source-of-truth files, invariants, checklists, contracts)
- any remaining doc gaps explicitly marked for follow-up

Suggest:
- **Commit** with ticket number
- **`/review`** for full PR review
- **`/compound`** if a non-trivial bug was fixed
- **Lambda deploy** reminder if Lambda repos were touched

---

## Conventions

**Patterns:** kebab-case files, PascalCase classes; consistent error capture; TypeORM CLI for migrations when applicable; English text.

**Commits:** `[TICKET-XXXX] <emoji> <type>(<scope>): <subject>` per `rules/commits.mdc`.

**Lambda deploy:** Run from Lambda repo root after SSO login. Use project deploy scripts only.

**No tests:** Do not write or run unit tests or E2E tests unless project rules require it.

**Protected:** Never delete `docs/plans/`, `docs/solutions/`, `docs/lambdas/`, `docs/modules/`, `docs/features/`, `docs/decisions/`, `docs/work-plans/`.
