---
name: brainstorm
description: >
  Feature exploration and decision-making. Spawns 3 focused agents to research the feature,
  then resolves open questions through dialogue. Output is a concise decision document — the base for /plan.
  Saves to docs/brainstorms/.
argument-hint: "[feature idea or problem to explore]"
---

# Step 1 — Explore and Decide Feature Scope

**Note: The current year is 2026.**

Use this command to transform an idea into concrete decisions (scope, architecture, constraints, and open questions) that become the direct input for `/plan`.

---

## Feature Description

<feature_description> #$ARGUMENTS </feature_description>

If empty, ask: "What would you like to explore? Describe the feature, problem, or improvement."

---

## Phase 0: Quick Clarity Check

Read the feature description. If requirements are already complete and scope is clear, ask:
> "Requirements look clear. Proceed to `/plan` directly, or brainstorm first to surface integration impacts and architecture decisions?"

If the description is one vague sentence, ask one focused clarifying question before continuing. Otherwise proceed immediately.

---

## Phase 1: Context Loading

Before spawning agents, read these directly (no agent needed):

1. `docs/solutions/patterns/critical-patterns.md` — always if it exists
2. Recent `docs/brainstorms/` — check if there's an existing brainstorm for this topic
3. Recent `docs/plans/` — check if there's already a plan that touches this area

Consolidate: what already exists, what's been decided before.

---

## Phase 2: 3 Parallel Research Agents

Spawn all three agents **simultaneously** using the Task tool (`subagent_type: generalPurpose`). Do not wait for one before starting the next. Pass the full feature description + context from Phase 1 to each.

---

### Agent 1 — Codebase Research (`repo-research-analyst`)

> "Read and follow `agents/research/repo-research-analyst.md`. Map all existing code related to: `<feature_description>`. Return: exact file paths, entity names, service method names, API routes, DTOs, components, Lambda repos, and which rules apply."

---

### Agent 2 — Integration & Impact Analysis (`integration-impact-analyst`)

> "Read and follow `agents/research/integration-impact-analyst.md`. Map every integration impact of: `<feature_description>`. For every entity, Lambda, notification type, settings section, and permission check: does this feature touch it, change it, or could break it? Focus on: entity changes and migration needs, Lambda pipeline impact, breaking changes with severity."

---

### Agent 3 — Architecture & Infrastructure Analysis

> "Analyze the architecture and infrastructure needs for: `<feature_description>`. Determine:
> 1. Where does the logic live? (backend service, new Lambda, or both — and why)
> 2. What cloud services are needed? (new or existing: queues, storage, events, secrets, etc.)
> 3. Data model implications: new entities, new columns, new enums, new relationships
> 4. Infrastructure changes needed (new Lambda repo, new queue, new bucket, API changes, etc.)
> 5. Security approach: auth model, encryption needs, permission checks
>
> Ground everything in the project's current architecture. Check backend, IAC, and relevant Lambda repos for existing patterns."

---

**Wait for all agents to complete before proceeding to Phase 3.**

---

## Phase 3: Dialogue — Resolve Open Questions

Based on all agent findings, identify the **key open questions** — maximum 5 — that materially affect the architecture, data model, or integration approach.

Ask them **one at a time**, with **multiple choice answers** when possible. Continue until user says "proceed" or all critical questions are answered.

**Focus only on questions that change the design.** Do not ask about:
- Implementation details decided by project rules (TypeORM? if used. Which DB? if applicable.)
- Patterns already established in `docs/solutions/patterns/critical-patterns.md`

---

## Phase 4: Write the Decision Document

Write to `docs/brainstorms/<TIMESTAMP>-<topic>-brainstorm.md` (current time in `YYYYMMDDHHmmss`). Ensure `docs/brainstorms/` exists.

The document **must** contain these sections, in order:

---

### 1. What We're Building
Plain-language description: what the feature does, who it's for, what it replaces or complements. 2-3 paragraphs max. No implementation details here.

### 2. Current State
What exists today that this feature builds on or changes:
- Backend: entities, services, API routes (with file paths)
- Frontend: components, services, routes (with file paths)
- Lambda pipelines relevant to this feature
- Existing plans/brainstorms already completed for related areas

### 3. Architecture & Infrastructure
*(From Agent 3)*
- **Where the logic lives** — backend service, Lambda, or both (with rationale)
- **Cloud services** — new or existing (queues, storage, events, etc.)
- **Data model** — new entities, columns, enums, relationships (overview, not full schema)
- **Infrastructure changes** — new repos, queues, buckets, API routes
- **Security approach** — auth model, encryption, permission checks

### 4. Integration Impact
*(From Agent 2)*
- Entity impact (what changes, new fields, migration needed)
- Lambda pipeline impact (which Lambdas are affected, risk level)
- Frontend feature impact (which components change, new routes)
- Breaking changes (severity + mitigation)

### 5. Key Decisions
Numbered list of every decision made during the brainstorm. Mark each:
- `✅ DECIDED:` — resolved during dialogue or evident from context
- `⚠️ OPEN:` — needs resolution during `/plan` (with brief explanation of options)

### 6. Open Questions
Numbered list of unresolved questions that `/plan` will need to resolve. If none: "All questions resolved during brainstorm."

### 7. Next Steps
- Run `/plan` to generate the implementation plan
- Specific areas that need deeper investigation during planning
- Any prerequisites (cloud service setup, third-party accounts, etc.)

---

## Phase 5: Post-Brainstorm

Present the user with:

1. **Top 3 decisions made** — the most important choices captured.
2. **Top risks or open items** — anything unresolved.
3. **Recommendation:** Run `/plan <path-to-this-brainstorm>` to create the implementation plan.

---

## Conventions

- **TypeORM migrations:** Never manual — always `npm run typeorm:generate` when applicable.
- **AWS CLI:** `aws sso login --profile <aws-profile>` before any AWS command when applicable. Never `cdk deploy` unless project-specific.
- **Lambda deploy:** `scripts/deploy-lambda-guaranteed.sh` only when applicable. Never via IAC.
- **User-facing text:** English only.
- **Commit format:** `[TICKET-XXXX] <emoji> <type>(<scope>): <subject>` — ask for ticket before first commit.
- **No unit tests or E2E tests** — do not plan test tasks unless project rules require it.
