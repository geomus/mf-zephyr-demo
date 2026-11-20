# <project-name>

<!-- Keep under ~100 lines. Only what an agent cannot learn by reading the repo: commands, constraints, decisions made outside the code, gotchas. No architecture tour. Add a line only after a mistake happens twice. -->

One line: what this is, for whom. Owner: <client or "own">.

## Commands

- Install: `pnpm install` (versions pinned in `mise.toml` and `packageManager`)
- Dev: `pnpm dev`
- All checks (run before saying done): `pnpm check`
- Single test: `pnpm test -- <file-or-pattern>`
- Typecheck only: `pnpm typecheck` · Lint and format: `pnpm lint` / `pnpm format`

## Constraints

- Allowed model providers for this code: <e.g. "Anthropic only" | "any" for own projects>. If a tool would send code or data elsewhere, stop and ask.
- Data region / compliance: <none | client requirement>.
- Do not add dependencies without asking; prefer platform and standard library APIs.
- Secrets only via env vars; names in `.env.example`. Never read `.env*` or `.dev.vars`.
- No deploys from the agent. Push a branch; preview comes from the Git integration; production is deployed by CI after I merge.

## Conventions

- Validate external input at the boundary with Zod (`src/lib/env.ts` for env, schemas next to each handler).
- Log with `src/lib/logger.ts` (one JSON line per event, with `correlationId`). No `console.log` in committed code.
- Errors: throw typed errors with an actionable message; never swallow.
- Commits: one line, conventional (`feat:`, `fix:`, `chore:` ...). No AI attribution.

## Decisions

- See `docs/decisions/` (one ADR per decision). Spec of the current work: `SPEC.md` when present.

## Gotchas

<!-- "Rule - why - enforced by: <test | lint | hook | doc only>" -->
