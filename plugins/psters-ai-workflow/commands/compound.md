---
name: compound
description: >
  Document a recently solved problem OR a new implementation pattern to compound team knowledge.
  Two modes: (1) /compound [context] — document a bug/problem fix in docs/solutions/. (2) /compound pattern [context] — document a reusable implementation pattern in docs/solutions/patterns/.
  Writes to docs/solutions/ with YAML frontmatter for learnings-researcher.
argument-hint: "[optional: brief context about the fix or 'pattern' for pattern mode]"
---

# Capture Reusable Learnings and Patterns

Use this command to explicitly register problem/solution learnings or reusable implementation patterns so future work can reuse them quickly.

## Modes

- `/compound` — document the most recent fix from conversation (problem → solution)
- `/compound [context]` — e.g. "N+1 in list", "trigger timeout"
- `/compound pattern` — document a reusable implementation pattern (not a bug fix)
- `/compound pattern [context]` — e.g. "role-based visibility", "new SQS Lambda pipeline stage"

---

## Mode 1: Problem/Solution (default)

### Purpose

Capture problem + solution + prevention while context is fresh. Uses YAML frontmatter (title, problem_type, components, symptoms, tags, module) for search.

### Phase 1: Parallel Research (text only — no file writes)

Launch in parallel; each returns **text** to the orchestrator:

1. **Context analyzer** — problem type, component, symptoms; YAML frontmatter skeleton (title, problem_type, components, symptoms, tags, module, date).
2. **Solution extractor** — root cause, working solution, code snippets.
3. **Related docs finder** — search `docs/solutions/` for related docs; cross-references.
4. **Prevention strategist** — how to avoid next time; tests if applicable.
5. **Category classifier** — choose `docs/solutions/<category>/` and filename (kebab-case).

### Phase 2: Pattern Check

After Phase 1, invoke `pattern-extractor` with the full context (the problem, the solution, and any code changes). If it returns a pattern document (not `NO_PATTERN_FOUND`), that pattern will also be written in Phase 3.

### Phase 3: Assembly & Write (orchestrator only)

After all Phase 1 results:

1. Merge all text into one problem/solution markdown document.
2. Validate frontmatter (required: title, problem_type, tags).
3. Ensure directory exists: `docs/solutions/<category>/`.
4. Write the problem/solution file: `docs/solutions/<category>/<filename>.md`.
5. **If `pattern-extractor` returned a pattern document:** Also write `docs/solutions/patterns/<category>/<filename>.md`.

### Phase 4: Optional Quality Review (by problem type)

If the documented problem is non-trivial, run one targeted agent via Task tool to validate the doc:

- `performance_issue` → invoke `performance-oracle`
- `security_issue` → invoke `security-sentinel`
- `database_issue` → invoke `data-integrity-guardian`
- Code-heavy → invoke `kieran-typescript-reviewer`

Pass: "Review this solution doc for accuracy and completeness: [doc content]"

---

## Mode 2: Pattern (`/compound pattern`)

### Purpose

Document a reusable implementation pattern — the "how to do X" guide. Goes directly to `docs/solutions/patterns/`.

### Phase 1: Invoke `pattern-extractor`

Invoke `pattern-extractor` with the full conversation context (what was implemented, the key code patterns). It returns:
- `NO_PATTERN_FOUND` — stop, nothing to document
- Or the full pattern document text with `FILENAME: <category>/<name>.md`

### Phase 2: Write

1. Ensure `docs/solutions/patterns/<category>/` directory exists.
2. Write the returned document to `docs/solutions/patterns/<category>/<name>.md`.
3. Confirm: "Pattern documented: `docs/solutions/patterns/<category>/<name>.md`"

---

## Preconditions

- Problem is **solved** and verified (Mode 1).
- Non-trivial (worth documenting for future lookup).

## Categories

**Problem/Solution (`docs/solutions/`):**
- `configuration/`
- `database-issues/`
- `performance-issues/`
- `ui-bugs/`
- `integration-issues/`
- `logic-errors/`
- `security-issues/`
- `build-errors/`
- `test-failures/`
- `runtime-errors/`
- `monitoring/`

**Patterns (`docs/solutions/patterns/`):**
- `backend/` — NestJS, TypeORM, API patterns
- `frontend/` — Angular, RxJS, UI patterns
- `lambda/` — Lambda pipeline, SQS, EventBridge patterns
- `fullstack/` — patterns spanning multiple repos/layers
- `auth/` — auth, permissions, guard patterns
- `notifications/` — notification pipeline patterns

## Success

Confirm: "Documentation complete. File: `docs/solutions/<category>/<filename>.md`" (and pattern file if applicable). Suggest: link related docs, run `/plan` or continue workflow.
