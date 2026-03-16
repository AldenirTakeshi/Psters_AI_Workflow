---
name: plan
description: >
  Create a detailed, execution-ready implementation plan. Thorough research + review agents
  ensure each phase can be executed directly by /work-plan without additional planning. Saves to docs/plans/.
argument-hint: "[feature description, bug report, or path to brainstorm doc]"
---

# Step 2 — Build an Execution Plan

**Note: The current year is 2026.**

Use this command to convert the feature context (or brainstorm) into a phased, execution-ready plan in `docs/plans/` that `/work-plan` can run directly.

---

## ⚠️ Subagent Invocation (REQUIRED)

All agents must be invoked via the Task tool (`subagent_type: generalPurpose`). Do not simulate or inline the agent's work. For each agent, instruct it to **read its agent file** and execute with the given input.

| Agent | File path |
|-------|-----------|
| repo-research-analyst | `agents/research/repo-research-analyst.md` |
| learnings-researcher | `agents/research/learnings-researcher.md` |
| spec-flow-analyzer | `agents/workflow/spec-flow-analyzer.md` |
| migration-impact-planner | `agents/research/migration-impact-planner.md` |
| architecture-strategist | `agents/review/architecture-strategist.md` |
| security-sentinel | `agents/review/security-sentinel.md` |
| performance-oracle | `agents/review/performance-oracle.md` |
| best-practices-researcher | `agents/research/best-practices-researcher.md` |
| framework-docs-researcher | `agents/research/framework-docs-researcher.md` |

---

## 0. Input

<feature_description> #$ARGUMENTS </feature_description>

If empty, ask: "What would you like to plan? Describe the feature, bug fix, or improvement."

**Brainstorm check:** Search `docs/brainstorms/` for a matching brainstorm. If found, read it fully — it contains architecture decisions, integration impact, and resolved questions that drive this plan. Also read any related existing plans in `docs/plans/`.

---

## 1. Research

### Round 1 — Always (spawn all in parallel via Task tool, `subagent_type: generalPurpose`):

- **repo-research-analyst** — maps file paths, services, DTOs, entities, rules, existing enums, current migration state for the affected area
- **learnings-researcher** — surfaces relevant solutions from `docs/solutions/`
- **spec-flow-analyzer** — finds missing flows, edge cases, error states; produces Given/When/Then acceptance criteria and tasks to add

### Round 2 — Conditional (spawn applicable in parallel via Task tool, `subagent_type: generalPurpose`):

- **migration-impact-planner** — spawn if entity changes detected (new columns, entities, indexes, FK constraints, enum changes)
- **best-practices-researcher** — spawn if the feature involves security, payments, or new third-party integrations
- **framework-docs-researcher** — spawn if the feature requires unfamiliar framework patterns

### Round 3 — Review (spawn applicable in parallel via Task tool, `subagent_type: generalPurpose`):

- **architecture-strategist** — always: structural approach, module boundaries, dependency direction
- **security-sentinel** — only if auth, secrets, permissions, encryption, or file upload involved
- **performance-oracle** — only if DB-heavy (new queries, pagination, indexes, N+1 risks)

Consolidate all findings: exact file paths, method names, learnings, conventions, acceptance criteria, architecture feedback.

---

## 2. Scope & Concretization

### 2a. When copying or mirroring existing features:
- Open the existing feature/component. Derive: files and sizes, sections/sub-components, flows to strip vs keep.
- In the plan: enumerate "copy these files, strip A/B/C, keep D" or document copy vs reuse decision.
- Split large copies into multiple tasks.

### 2b. When the feature has many requirements (5+ items):
- Parse and group requirements by layer (backend/frontend) or capability.
- Add a **Scope / Work Breakdown** section listing each group with its requirements.
- Assign groups to phases. Cap phase size — no phase should have 10+ unrelated items.

### 2c. When inline editing is involved:
- List editable fields/sections from the codebase or backend DTOs.
- Document the UX pattern (edit toggle per section, global edit mode, or click-to-edit).
- Reference in implementation tasks.

### 2d. When a different API serves the same UI:
- Document response shape of the new API and mapping to the shape the UI expects.
- Include a mapping task in implementation.

If none of the above apply, skip this step.

---

## 3. Phase Assessment

Use **phases** when: multi-layer (DB + API + frontend), 4+ files, clear dependency chain. Otherwise use **flat tasks** (a single numbered list under `## Implementation`).

If phased: phases are dependency-ordered. Each phase must have a **clear theme** and a **bounded** set of tasks. Apply splitting and grouping rules from Step 2.

---

## 4. Write Plan

Write to `docs/plans/<TIMESTAMP>-<name>-plan.md` (`TIMESTAMP` = current time in `YYYYMMDDHHmmss`).

### YAML frontmatter:

```yaml
---
title: "<Plan Title>"
type: enhancement | bug | refactor
status: active
date: YYYY-MM-DD
phased: true | false
---
```

### Required sections:

1. **Overview** — Problem/Motivation, what we're building, who it's for
2. **Scope / Work Breakdown** — (if applicable from 2b) Groups of requirements mapped to phases
3. **Proposed Solution** — Architecture, data model, key design decisions. Reference brainstorm decisions if one exists.
4. **Technical Considerations** — Reference project rules (TypeORM, error capture, English text), `docs/solutions/` patterns, security notes, migration safety
5. **Acceptance Criteria** — From spec-flow-analyzer: Given/When/Then covering happy path, all roles, and error states
6. **Implementation Plan** — Phases or flat tasks (see format below)
7. **Master Checklist** — Every task as a checkbox

### Phase format (phased plans):

The `## Implementation Plan` section **must** open with a summary table, then each phase:

```
## Implementation Plan

| Phase | Name | Depends On | Status |
|-------|------|------------|--------|
| 1 | [Phase 1 name] | None | ⬜ Pending |
| 2 | [Phase 2 name] | Phase 1 | ⬜ Pending |

---

### Phase N: [Name]

**Status**: ⬜ Pending
**Objective**: [One sentence — what this phase achieves]
**Dependencies**: [Phase N-1 or None]

**Tasks**:

1. **[Task name]** (`path/to/file.ts`):
   - Add `methodName(param: Type): ReturnType` to `ClassName`
   - Add column `column_name` (varchar, nullable, default null) to `EntityName`
   - Import `X` from `path` in module `Y`

2. **[Task name]** (`path/to/file.ts`):
   - ...

**After completing this phase**:
1. Build — `npm run build` in affected repos; fix all errors.
2. Update this plan — mark Phase N as `✅ Completed` in the table.
```

### Flat tasks format (non-phased):

```
## Implementation

1. **[Task name]** (`path/to/file.ts`):
   - Specific change: method name, field name, decorator, class

2. **[Task name]** (`path/to/file.ts`):
   - ...

**After implementation**: `npm run build`, fix all errors.
```

### Master Checklist (always required for phased plans):

```
## ✅ Master Checklist

### Phase 1: [Name]
- [ ] [Task 1 short label]
- [ ] [Task 2 short label]
- [ ] Build passes

### Phase 2: [Name]
- [ ] ...
```

---

## 5. Task Quality Rules

Every task MUST have:
- **Bold name** with the primary **file path** in parentheses
- **Concrete sub-bullets** with: method signatures, field names with types, DTO property names, import paths
- Enough detail that an AI can execute it without guessing

Every task MUST NOT have:
- Vague descriptions like "implement the feature" or "add the logic"
- Test-related steps (unless project rules require tests)
- Multiple unrelated concerns in one task

**Migration tasks are special:** When a phase includes entity changes that require a migration, the migration task MUST explicitly state: "Generate migration → drift-check → run locally IMMEDIATELY (atomic chain — see typeorm-migrations rule)." This prevents the AI from deferring the local run, which causes schema drift in subsequent migrations.

**Self-validation:** After writing, review every task. Ask: "Could an AI execute this task by reading only this plan and the referenced files?" If no, rewrite it inline before presenting.

---

## 6. Post-Generation

Present: plan summary, phase count, task count. Offer:
- Start `/work-plan [path]` to execute the first phase
- Review a specific section
- Continue refining

---

## Conventions

- **TypeORM migrations:** CLI only (`npm run typeorm:generate`). Never create migration files manually.
- **AWS:** CLI + SSO only (`aws sso login --profile <aws-profile>`). Never `cdk deploy` unless project-specific.
- **Lambda deploy:** Guaranteed scripts only.
- **Error capture:** Consistent error capture for all frontend errors.
- **User-facing text:** English only.
- **Commits:** `[TICKET-XXXX] <emoji> <type>(<scope>): <subject>`.
- **Context7:** Use the Context7 MCP for library documentation when relevant.
