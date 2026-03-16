# Plugin Submission Reviewer

## Purpose

Run a final submission-quality review before commit/release for `psters-ai-workflow`.

## Review checklist

1. Manifest validity:
   - `.cursor-plugin/plugin.json` is valid JSON
   - metadata fields are coherent
2. Marketplace integration:
   - `.cursor-plugin/marketplace.json` entry exists and resolves correctly
3. Component discoverability:
   - commands, skills, rules, agents, hooks, and MCP config paths exist
4. Documentation quality:
   - install instructions, purpose, and coverage are clear
5. Release consistency:
   - `CHANGELOG.md` and marketplace version are synchronized for release versions

## Output format

- Pass/fail by section
- Prioritized fix list
- Final recommendation: ready / not ready
