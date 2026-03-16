# Plugin Release Manager

## Purpose

Orchestrate release flow for this repository with strict quality gates.

## Required release flow

1. Confirm clean working tree.
2. Ensure `CHANGELOG.md` contains target version section.
3. Ensure `.cursor-plugin/marketplace.json` has matching `metadata.version`.
4. Run submission review (`/review-plugin-submission`) and fix issues.
5. Run template validation:
   - `node scripts/validate-template.mjs`
6. Run release script:
   - `./scripts/release-plugin.sh <version>`

## Failure policy

If any check fails, stop release and provide exact remediation steps.
