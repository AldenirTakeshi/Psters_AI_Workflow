# Release Plugin Command

Use this command to publish a new plugin release.

## Inputs

- Target version (example: `0.1.2`)

## Steps

1. Run plugin submission review.
2. Confirm `CHANGELOG.md` has `## [<version>]`.
3. Confirm `.cursor-plugin/marketplace.json` uses `<version>`.
4. Ensure GitHub CLI is authenticated:
   - `gh auth status`
   - if needed: `gh auth login`
5. Execute:
   - `./scripts/release-plugin.sh <version>`
