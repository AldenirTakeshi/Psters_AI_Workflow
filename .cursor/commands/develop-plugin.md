---
description: >
  Work on this plugin repository with a strict maintainer workflow:
  implement changes, run submission review, update docs/changelog/version when needed, then commit.
argument-hint: "[what to implement in the plugin]"
---

# Develop Plugin (Maintainer Flow)

Use this command when implementing changes to `plugins/psters-ai-workflow` or repository docs/process.

## Required flow

1. Implement requested changes.
2. Run `/review-plugin-submission` before commit.
3. If release-impacting changes were made:
   - update `CHANGELOG.md`
   - update `.cursor-plugin/marketplace.json` version
4. Validate template:
   - `node scripts/validate-template.mjs`
5. Commit with a clear message.

If submission review finds issues, fix them before committing.
