# Develop Plugin Command

Use this command to implement changes in this plugin repository safely.

## Steps

1. Implement requested changes.
2. Run plugin submission review and fix issues.
3. If release-impacting, update:
   - `CHANGELOG.md`
   - `.cursor-plugin/marketplace.json` version
4. Validate template:
   - `node scripts/validate-template.mjs`
5. Commit changes.
