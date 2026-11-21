# AI workflow

How AI (Claude Code, sandboxed) was used on this repo: one short entry per working session. What was asked, what I decided, what I corrected. No transcripts.

## 2026-11-20 · Requirements

- **Asked:** read the project brief, then write down the requirements: each one quoted, read in its strictest form, with how it gets verified.
- **AI did:** drafted 15 requirements, the three biggest risks and six open questions with a recommended answer for each. It checked the Zephyr docs for the meaning of "default Cloud integration": the docs describe a managed model, and I did not find a definition of the term.
- **I decided:** the managed-cloud reading for now, pending confirmation; disclose my first-time tools plainly (Module Federation, Zephyr, Rspack, Biome); keep this log short, one entry per session.
- **I corrected / added:** the requirements now expect that I may need to modify the repo live, so they gained one: the repo must be easy to extend.

## 2026-11-21 · Spec, plan and local build

- **Asked:** a spec and a short plan, each step with how it is verified, reviewed against the requirements by a separate read-only agent before building. Then the local host and remote, without deploying.
- **AI did:** read the Zephyr docs and the installed plugin source, built both apps, wrote the tests, and started the decision and friction logs. The review caught a gap in the demo flow and a hard-coded localhost remote, and both were fixed in the plan.
- **I decided:** a dev-only localhost URL is acceptable; plain CSS; dropping the skeleton's env and logger helpers; the dependency list; pnpm 12 (later moved back to 11, see below).
- **Changed on evidence:** `ZE_DISABLED=true` was in the approved plan, but the plugin still touched the home folder at import, so deploy became opt-in. pnpm 12 failed in the sandbox, so pnpm 11 is pinned. Both are logged in `docs/decisions.md`.

## 2026-11-21 · First deploys and fixes

- **Asked:** commit the local build, then deploy the remote and the host through Zephyr, with me running the deploys and pasting the output.
- **AI did:** read the error codes and the plugin source to explain each failure, proposed the fixes, kept the decision and friction logs current, and wrote the README and runbook.
- **I decided:** to run the deploys myself outside the agent's sandbox, to delete the first throwaway project from the dashboard, and to leave pushed commits alone instead of rewriting them.
- **Found by testing, not by the AI:** the host page went blank when the remote was down (the runtime fetches remotes before React mounts), and `remote@latest` did not resolve because Zephyr's default tag is named differently. Both are fixed and logged.
- **Also found by testing:** `remote@*` froze the remote into the host build, so the host kept showing the old release. Moving to a tag (`remote@latest`) fixed it, and a rollback was shown with the dashboard's Redeploy button. Both are in `docs/decisions.md`.
