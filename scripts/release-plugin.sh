#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./scripts/release-plugin.sh <version>"
  echo "Example: ./scripts/release-plugin.sh 0.1.2"
  exit 1
fi

VERSION="$1"
TAG="v${VERSION}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARKETPLACE_JSON="${ROOT_DIR}/.cursor-plugin/marketplace.json"
CHANGELOG_MD="${ROOT_DIR}/CHANGELOG.md"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd git
require_cmd gh
require_cmd node

cd "${ROOT_DIR}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash changes before release." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

echo "Running plugin template validation..."
node scripts/validate-template.mjs

echo "Checking marketplace version..."
MARKETPLACE_VERSION="$(node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('${MARKETPLACE_JSON}','utf8'));process.stdout.write(data.metadata.version)")"
if [[ "${MARKETPLACE_VERSION}" != "${VERSION}" ]]; then
  echo "Marketplace version mismatch: expected ${VERSION}, found ${MARKETPLACE_VERSION}" >&2
  echo "Update .cursor-plugin/marketplace.json before release." >&2
  exit 1
fi

echo "Checking changelog section..."
if ! node -e "const fs=require('fs');const txt=fs.readFileSync('${CHANGELOG_MD}','utf8');const re=new RegExp('^## \\\\[${VERSION}\\\\]','m');process.exit(re.test(txt)?0:1)"; then
  echo "CHANGELOG.md does not contain section ## [${VERSION}]." >&2
  echo "Update CHANGELOG.md before release." >&2
  exit 1
fi

if git rev-parse "${TAG}" >/dev/null 2>&1; then
  echo "Tag ${TAG} already exists." >&2
  exit 1
fi

echo "Creating git tag ${TAG}..."
git tag -a "${TAG}" -m "Release ${TAG}"

echo "Creating GitHub release ${TAG}..."
gh release create "${TAG}" \
  --title "${TAG}" \
  --notes-file "${CHANGELOG_MD}"

echo "Release ${TAG} created successfully."
