# mf-zephyr-demo

<!-- Keep under ~100 lines. Only what an agent cannot learn by reading the repo: commands, constraints, decisions made outside the code, gotchas. No architecture tour. Add a line only after a mistake happens twice. -->

A Module Federation host and remote (Rspack, React, TypeScript) deployed with Zephyr Cloud, as a small reproducible demo. Personal project.

## Commands

- Install: `pnpm install` (versions pinned in `mise.toml` and `packageManager`)
- Dev: `pnpm dev`
- All checks (run before saying done): `pnpm check`
- Single test: `pnpm test -- <file-or-pattern>`
- Typecheck only: `pnpm typecheck` · Lint and format: `pnpm lint` / `pnpm format`
- Deploy through Zephyr (owner's OK first, remote before host): `pnpm zephyr:remote`, `pnpm zephyr:host`, `pnpm zephyr:all`. Never add a script named `deploy` (pnpm has a built-in `deploy`).

## Constraints

- Allowed model providers for this code: Anthropic only. If a tool would send code or data elsewhere, stop and ask.
- Data region / compliance: none.
- Do not add dependencies without asking; prefer platform and standard library APIs.
- Secrets only via env vars; names in `.env.example`. Never read `.env*` or `.dev.vars`.
- A Zephyr-enabled build uploads and deploys. The agent runs one only after the owner's explicit OK for that deploy; checks and CI build without the Zephyr step. The agent never pushes.

## Conventions

- Validate external input at the boundary (no external input today: no env vars, no API).
- No `console.log` in committed code. Browser errors go to `console.error` only where a `biome-ignore` explains why.
- Errors: throw typed errors with an actionable message; never swallow.
- Commits: one line, conventional (`feat:`, `fix:`, `chore:` ...). No AI attribution.

## Decisions

- See `docs/decisions.md` (dated, what won and what lost). Friction while building goes to `docs/friction-log.md`, with the time. Spec of the current work: `SPEC.md` when present.

## Gotchas

<!-- "Rule - why - enforced by: <test | lint | hook | doc only>" -->

- Import `zephyr-rspack-plugin` only inside the `env.zephyr` branch of `rspack.config.ts` - loading it creates `~/.zephyr` even with `ZE_DISABLED=true` - doc only.
- The host's remote key and value prefix (`remote@`) must match the remote's package name - Zephyr rewrites only matching remotes - test (`apps/host/src/federation.test.ts`).
