# Runbook

Operational facts for whoever runs this project (me, the client, or an agent). Keep it current: an agent updates it whenever it adds a secret, an environment or a scheduled job.

## Environments

| Env        | URL            | Hosting account (owner) | Deploys from             |
| ---------- | -------------- | ----------------------- | ------------------------ |
| preview    | per-branch URL | <client account>        | Git integration on push  |
| production | <domain>       | <client account>        | CI after merge to `main` |

## Secrets

Every secret the app reads. Values never in the repo, chat or tickets.

| Name              | Used by   | Stored in             | Owner  | Scope / permissions | Last rotated |
| ----------------- | --------- | --------------------- | ------ | ------------------- | ------------ |
| `EXAMPLE_API_KEY` | `src/...` | platform secret store | client | read-only           | YYYY-MM-DD   |

### Rotation (per secret, and all at once if a provider reports an incident)

1. Create the new credential in the provider with the same minimal scope.
2. Update it in the secret store of every environment (preview, production, CI).
3. Redeploy or restart so the new value is read; confirm a request succeeds.
4. Revoke the old credential in the provider.
5. Update "Last rotated" above. If rotation was triggered by an incident, note the date and the provider notice in `docs/decisions/`.

## Deploy and rollback

- Deploy: merge to `main`; CI deploys with its own token. The coding agent never deploys to production.
- Rollback: <platform command or dashboard step to promote the previous version>.

## Scheduled jobs and webhooks

| Name | Trigger | What it does | Where to see runs | How to pause |
| ---- | ------- | ------------ | ----------------- | ------------ |

## When something breaks

1. Find the failing request or run by `correlationId` in logs, then the same id in error tracking.
2. Check provider status pages (hosting, database, payment, messaging).
3. Pause scheduled jobs that write to external systems before fixing.

## Spend limits

| Provider | Hard cap or alert | Where configured |
| -------- | ----------------- | ---------------- |
