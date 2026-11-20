# project-name

What it is and who it is for, in one paragraph.

## Run locally

```sh
mise install          # node and pnpm versions from mise.toml
pnpm install
pnpm hooks:install    # pre-commit: format, lint, typecheck
cp .env.example .env  # fill values (never commit .env)
pnpm dev
```

## Checks

`pnpm check` runs format/lint, typecheck, tests and build. CI runs the same in parallel jobs.

## Docs

- `AGENTS.md`: rules for coding agents (also read by humans).
- `docs/runbook.md`: environments, secrets and rotation, deploy, rollback.
- `docs/decisions/`: one ADR per decision.
