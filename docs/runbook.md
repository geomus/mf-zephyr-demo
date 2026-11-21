# Runbook

Operational facts for whoever runs this project.

## Environments

| App    | URL                                                      | Deploys from                    |
| ------ | -------------------------------------------------------- | ------------------------------- |
| remote | printed by `pnpm zephyr:remote`; stable URL: the tag URL | the owner's machine, on request |
| host   | printed by `pnpm zephyr:host`; stable URL: the tag URL   | the owner's machine, on request |

Hosting is Zephyr's managed cloud. No cloud account of our own.

## Secrets

There are none in the repo or in CI. The only credential is the Zephyr login token, stored locally in `~/.zephyr` after the first browser login.

- Revoke or rotate: sign out or revoke the session in the Zephyr dashboard, then delete the local login and log in again on the next deploy.
- CI deploys would need a Zephyr CI token (`ZE_CI_TOKEN`) in the CI secret store. Not set up.

## Deploy and rollback

- Deploy: `pnpm zephyr:remote`, then `pnpm zephyr:host`. Remote first: the host resolves it at build time. Never commit a script named `deploy` (pnpm has a built-in `deploy`).
- Rollback: in the Zephyr dashboard, open the app, then the version list, and use the Rollback button. It goes only to the immediately previous version.
- Remove a project: delete it in the dashboard. Version numbers keep counting.

## When something breaks

1. Host shows "The remote could not be loaded": open the browser console and read the Module Federation error, then check that the remote's URL answers.
2. Host build prints `Failed to resolve remote dependencies`: deploy the remote first, and check the selector in `apps/host/package.json`.
3. Check Zephyr's status and docs: https://docs.zephyr-cloud.io/
