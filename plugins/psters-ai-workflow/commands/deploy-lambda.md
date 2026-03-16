---
name: deploy-lambda
description: >
  Deploy Lambda functions using the guaranteed deploy scripts only. Never deploy via IAC (CDK). Requires AWS SSO login first. Use when deploying any Lambda repo.
argument-hint: "[lambda-name or 'all']"
---

# Deploy Lambda with Guaranteed Scripts

Use this command to deploy Lambda changes safely through project-approved deploy scripts (AWS CLI flow only, no CDK/IaC deploy path).

## Rule: Use the guaranteed deploy scripts

Each Lambda repo that has deploy scripts must use them:

- **Single function:** `./scripts/deploy-lambda-guaranteed.sh <lambda-name> [--profile PROFILE] [--region REGION]`
- **All functions in repo:** `./scripts/deploy-all-lambdas-guaranteed.sh [--profile PROFILE] [--region REGION]`

Script names may vary by repo (e.g. `deploy-lambda-guaranteed.sh`, `deploy-all-lambdas-guaranteed.sh`). Look in that repo's `scripts/` folder.

## Prerequisite: AWS SSO login

Before **any** AWS CLI command (including deploy):

```bash
aws sso login --profile <aws-profile>
```

Replace `<aws-profile>` with the project's AWS profile (e.g. `Production`, `Staging`). If you skip this, deploy will fail with credential/session errors.

## Where to run

- **From the Lambda repo root** (e.g. `notification-processor`, `reply-suggestions-lambda`):  
  `./scripts/deploy-lambda-guaranteed.sh <name> --profile <aws-profile> --region <region>`
- Default profile and region vary by project; pass explicitly if the script supports it.

## Lambda name

The first argument is the **Lambda package/name** (e.g. `notification-processor`, `appsync-publisher`). Run the script with `--help` to see available names for that repo.

## After deploy

- Scripts typically build, package, and call `aws lambda update-function-code` (or create if missing). Idempotent and safe to re-run.
- If deploy fails, check: (1) SSO logged in, (2) correct repo and script path, (3) correct lambda name for that repo.

## Do not

- Run `cdk deploy` or any IAC to deploy Lambda code.
- Manually zip and upload unless the repo has no script and you are adding the script as part of the work.
