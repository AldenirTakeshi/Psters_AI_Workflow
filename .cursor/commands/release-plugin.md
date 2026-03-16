---
description: >
  Release the plugin with required checks: submission review, changelog/version sync,
  template validation, git tag, and GitHub release via gh CLI.
argument-hint: "[version, e.g. 0.1.2]"
---

# Release Plugin

Use this command to publish a new version after development is complete.

## Required pre-release checks

1. Run `/review-plugin-submission` and resolve findings.
2. Ensure `CHANGELOG.md` has section `## [<version>]`.
3. Ensure `.cursor-plugin/marketplace.json` has `metadata.version = <version>`.
4. Ensure clean git working tree.

## Release command

```bash
./scripts/release-plugin.sh <version>
```

If `gh auth status` fails, run:

```bash
gh auth login
```
