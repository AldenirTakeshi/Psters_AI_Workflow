---
name: doc
description: >
  Documentation command. Modes: (1) /doc lambda <repo> — Lambda doc, (2) /doc lambdas — all Lambdas, (3) /doc module <module> — NestJS backend module doc, (4) /doc feature <feature> — Angular feature doc, (5) /doc architecture — system architecture overview, (6) /doc update — scan all docs for staleness and contradictions, (7) /doc adr "<decision>" — create an Architecture Decision Record.
argument-hint: "lambda <repo> | lambdas | module <module> | feature <feature> | architecture | update | adr <decision>"
---

# Force Technical Documentation by Scope

**Note: The current year is 2026.**

Use this command when you want explicit technical documentation output for a specific scope (module, feature, architecture, ADR, or global update). `/work` and `/work-plan` already update docs automatically.

The living documentation lives in:
- `docs/lambdas/` — Lambda and processor repos
- `docs/modules/` — NestJS backend modules (or equivalent)
- `docs/features/` — Angular frontend features (or equivalent)
- `docs/decisions/` — Architecture Decision Records (ADRs)
- `docs/architecture.md` — System-wide architecture overview

## Input

<doc_target> #$ARGUMENTS </doc_target>

If empty, show:
```
Usage:
  /doc lambda <repo-name>      Document a Lambda repo     (e.g. /doc lambda email-classifier-lambda)
  /doc lambdas                 Document ALL Lambda repos in parallel
  /doc module <module-name>    Document a backend module   (e.g. /doc module projects)
  /doc feature <feature-name>  Document a frontend feature (e.g. /doc feature dashboard)
  /doc architecture            Generate/update docs/architecture.md
  /doc update                  Scan all docs for staleness and contradictions
  /doc adr "<decision>"        Create an Architecture Decision Record
```

---

## Mode 1: `/doc lambda <repo-name>`

### Step 1: Verify repo exists
Check that the Lambda repo exists in the workspace. If not, list available Lambda repos and ask user to pick.

### Step 2: Invoke `lambda-doc-writer`
Spawn a Task tool agent (`subagent_type: generalPurpose`) with the full `lambda-doc-writer` agent instructions, passing the repo path and any existing `docs/lambdas/<repo-name>.md`. Wait for the agent to return text.

### Step 3: Write the doc
- Ensure `docs/lambdas/` directory exists
- Write returned text to `docs/lambdas/<repo-name>.md`
- Confirm: "Lambda documentation written: `docs/lambdas/<repo-name>.md`"

---

## Mode 2: `/doc lambdas`

### Step 1: Discover all Lambda repos
Discover Lambda repos in the workspace (e.g. `*-lambda`, `*-processor` or project-specific patterns).

### Step 2: Spawn all `lambda-doc-writer` agents in parallel
Spawn one Task tool agent per Lambda repo **simultaneously**. Each returns text to orchestrator.

### Step 3: Write all docs
For each returned doc, write to `docs/lambdas/<repo-name>.md`. Confirm each.

### Step 4: Update `docs/lambdas/README.md`
Update the index table with all documented Lambdas, their pipeline position, and links to individual docs.

---

## Mode 3: `/doc module <module-name>`

### Step 1: Verify module exists
Check that `backend/src/<module-name>/` (or equivalent) exists. If not, list available modules and ask user to pick.

### Step 2: Invoke `backend-module-doc-writer`
Spawn a Task tool agent (`subagent_type: generalPurpose`) with the full `backend-module-doc-writer` agent instructions, passing:
- Module path: `backend/src/<module-name>/`
- Existing doc if present: `docs/modules/<module-name>.md`

Wait for the agent to return text.

### Step 3: Write the doc
- Ensure `docs/modules/` directory exists
- Write returned text to `docs/modules/<module-name>.md`
- Update `docs/modules/README.md` — add or update the entry for this module in the catalog table
- Confirm: "Module documentation written: `docs/modules/<module-name>.md`"

---

## Mode 4: `/doc feature <feature-name>`

### Step 1: Verify feature exists
Check that `frontend/src/app/features/<feature-name>/` (or equivalent) exists. If not, list available features and ask user to pick.

### Step 2: Invoke `frontend-feature-doc-writer`
Spawn a Task tool agent (`subagent_type: generalPurpose`) with the full `frontend-feature-doc-writer` agent instructions, passing:
- Feature path: `frontend/src/app/features/<feature-name>/`
- Existing doc if present: `docs/features/<feature-name>.md`

Wait for the agent to return text.

### Step 3: Write the doc
- Ensure `docs/features/` directory exists
- Write returned text to `docs/features/<feature-name>.md`
- Update `docs/features/README.md` — add or update the entry for this feature in the catalog table
- Confirm: "Feature documentation written: `docs/features/<feature-name>.md`"

---

## Mode 5: `/doc architecture`

### Step 1: Gather context (parallel reads)
Read simultaneously:
- All files in `docs/lambdas/` (if they exist)
- All files in `docs/modules/` (if they exist)
- All files in `docs/features/` (if they exist)
- `docs/solutions/patterns/critical-patterns.md`
- Project structure rules
- The 5 most recent `docs/plans/*.md` files
- The 3 most recent `docs/brainstorms/*.md` files
- `docs/decisions/` — all ADRs

### Step 2: Invoke architecture doc agent
Spawn a Task tool agent with all gathered context:
> "You are an architecture documentation writer. Based on the provided context (Lambda docs, module docs, feature docs, critical patterns, project structure rules, recent plans, brainstorms, and ADRs), generate/update docs/architecture.md — a living system architecture document covering: system overview, repo map, runtime stack, auth flow, Lambda pipeline catalog, data flow diagrams (ASCII), key design decisions, cross-repo integration points, and technology choices. Keep it concise and navigable. Include a table of contents."

### Step 3: Write the doc
Write to `docs/architecture.md`. Confirm.

---

## Mode 6: `/doc update`

Scan ALL living docs for staleness and contradictions without requiring a specific diff.

### Step 1: Discover all living docs
List all `.md` files in:
- `docs/lambdas/`
- `docs/modules/`
- `docs/features/`
- `docs/solutions/`
- `docs/decisions/`
- `docs/architecture.md`

### Step 2: Read the codebase state
For each doc, extract the file paths, class names, and method names it references. Check each against the actual codebase to find stale references.

**Efficient approach**: Read all `docs/solutions/patterns/` and `docs/lambdas/` first (highest churn), then module and feature docs.

### Step 3: Spawn `doc-shepherd` for full scan
Spawn a Task tool agent (`subagent_type: generalPurpose`) with the full `doc-shepherd` agent instructions. Since there's no specific diff to analyze, pass:
- `diff`: "Full documentation audit — no specific diff"
- `changed_files`: all files in the codebase (summary by directory)
- `work_summary`: "Full documentation freshness and consistency audit"

The agent should focus on contradiction detection across all docs.

### Step 4: Apply updates and report
Apply any updates the shepherd returns. Report to user: what was updated, what contradictions were found (and ask for resolution if any).

---

## Mode 7: `/doc adr "<decision>"`

Create an Architecture Decision Record documenting a significant architectural choice.

### Step 1: Parse the decision
The argument is a short description of the decision (e.g., `"use Mailgun over SES for transactional email"`).

### Step 2: Gather context
Ask the user (or infer from context) the following to fill the ADR:
- **Context**: Why was this decision needed? What problem or constraint prompted it?
- **Decision**: What exactly was decided?
- **Consequences**: What does this decision imply for the system?
- **Alternatives considered**: What other options were evaluated and why were they rejected?

If invoked after a brainstorm or plan, the context may already be available — read the most recent `docs/brainstorms/*.md` or `docs/plans/*.md` to extract this information.

### Step 3: Write the ADR
Generate a filename: `docs/decisions/YYYY-MM-DD-<slugified-decision>.md`

Use the canonical ADR template:

```markdown
---
type: decision
title: "<Decision Title>"
status: accepted
date: YYYY-MM-DD
supersedes: null
superseded_by: null
---

# ADR: <Decision Title>

## Context

[Why was this decision needed? What problem, constraint, or requirement prompted it? What was the situation before this decision?]

## Decision

[What was decided? Be specific. If there were sub-decisions (e.g. which library, which service, which architecture pattern), list each.]

## Consequences

[What are the effects of this decision?]

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative / Trade-offs:**
- [Trade-off 1]
- [Trade-off 2]

**Neutral:**
- [Side effect that's neither good nor bad]

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| [Alternative 1] | [Reason] |
| [Alternative 2] | [Reason] |

## Related

- [Link to relevant plan, brainstorm, or docs/solutions/ doc if applicable]
```

### Step 4: Update `docs/decisions/README.md`
Add an entry for the new ADR in the catalog table.

Confirm: "ADR created: `docs/decisions/<filename>.md`"

---

## Triggering from `/work` and `/work-plan`

When invoked automatically from Phase 5 of `/work` or `/work-plan`, the mode and target are passed as arguments. The flow is the same as above.
