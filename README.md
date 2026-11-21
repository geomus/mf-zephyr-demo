# mf-zephyr-demo

A small Module Federation setup deployed with [Zephyr Cloud](https://docs.zephyr-cloud.io/): a `host` app loads components from a `remote` app at runtime. Both are built with Rspack (React, TypeScript strict) and deployed through Zephyr's managed cloud. A new version of the remote reaches the already-deployed host without rebuilding the host.

The remote shares two UI components (a status badge and a flight status card, with invented data). The host owns the data and passes it in as props.

## Requirements

- Node 26 and pnpm 11 (pinned in `mise.toml` and `package.json`; tested with Node 26.13 and pnpm 11.28). [mise](https://mise.jdx.dev) installs both; it downloads Node from nodejs.org and pnpm from GitHub releases. Without mise (or without access to those sites), install Node 26 yourself and then `npm install -g pnpm@11.28.13`. Node 26 does not ship Corepack, so `corepack enable` is not available unless you install Corepack first.
- To run locally or run the checks: nothing else. No account, no network service, no environment variables.
- To deploy: a free Zephyr account, and a git repo with a branch, a commit and an `origin` remote (Zephyr derives the app name from them).

## Quick start

```sh
mise install      # optional: Node and pnpm from mise.toml
pnpm install
pnpm dev          # remote on :3001, host on :3000 (both ports must be free)
```

Open http://localhost:3000: a legend of three badges and three dashed flight cards, all loaded from the remote. Stop the remote and reload: the host stays up and shows "The remote could not be loaded."

Local runs never touch Zephyr: no login, no network, no `~/.zephyr`.

```sh
pnpm check        # Biome, typecheck, tests, build of both apps
```

CI (`.github/workflows/ci.yml`) runs the same steps without any Zephyr credentials.

## Repo layout

```
apps/
  remote/                    the remote app
    src/StatusBadge.tsx        exposed component
    src/FlightStatusCard.tsx   exposed component (uses the badge)
    src/release.ts             release number shown on the card; bump it to see a new version
    src/federation.ts          Module Federation config: name, exposes, shared React
    rspack.config.ts           build config (Zephyr loads only with --env zephyr)
  host/                      the host app
    src/App.tsx                loads the remote's components with React.lazy
    src/federation.ts          declares the remote (dev URL and a placeholder; see below)
    src/remote.d.ts            types of what the remote exposes
    src/flights.ts             invented sample data, passed to the remote as props
    src/RemoteBoundary.tsx     error message when the remote is down
    package.json               "zephyr:dependencies" maps the remote to a tag
docs/                        decisions, friction log, AI workflow, runbook
.github/workflows/ci.yml     checks without credentials
```

## Deploy with Zephyr

Deploying is opt-in: only `rspack build --env zephyr` loads the Zephyr plugin. Build the remote first, because the host resolves it at build time.

```sh
pnpm zephyr:remote     # first run opens a browser to log in
```

Then, once, in the Zephyr dashboard (remote app, DevOps, Tags, New Tag): create a tag named `latest` with the conditions Branch is `main` and Target is Web. Leave it unlocked, so it follows every new deploy.

```sh
pnpm zephyr:host       # must print: Resolved remotes: remote → https://t-latest-…
```

Each command prints a live URL. Open the host's: it loads the remote from Zephyr's edge.

How the host finds the remote:

- `apps/host/package.json` maps it: `"zephyr:dependencies": { "remote": "remote@latest" }`. `latest` is the tag created above, so the host follows wherever the tag points. In my run, `remote@*` was resolved once, at host build time, and the host did not see newer remote versions; a fixed version number would stay fixed by definition.
- `apps/host/src/federation.ts` holds a placeholder URL for the remote. On a Zephyr build the plugin replaces it with the resolved URL. If that fails, the host shows the error instead of pointing at a wrong address.
- The remote's package `name` must equal its Module Federation `name`.

To ship a new remote version: change the remote (for example bump `RELEASE` in `apps/remote/src/release.ts`), run `pnpm zephyr:remote`, reload the host. The host is not rebuilt. Rollback: in the dashboard, remote app, DevOps, Tags, `latest`, press **Redeploy** on the previous version, then reload the host (a change takes up to about a minute to show).

The URLs change with every deploy. A tag URL (dashboard, DevOps, Tags) stays the same while the tag moves between versions.

## Change it

- **Add an exposed module:** create `apps/remote/src/<Name>.tsx` with a default export, add `"./<Name>": "./src/<Name>.tsx"` to `exposes` in `apps/remote/src/federation.ts`, declare `remote/<Name>` in `apps/host/src/remote.d.ts`, and `lazy(() => import("remote/<Name>"))` in the host. `pnpm check` fails if an exposed file has no default component.
- **Add a remote:** copy `apps/remote`, give it a new `name` (package and Module Federation), add it to `remotes` in `apps/host/src/federation.ts` and to `zephyr:dependencies`, and deploy it before the host.

## Decisions and notes

- `docs/decisions.md`: what was chosen, what was not, and why.
- `docs/friction-log.md`: where the docs or tooling were unclear, slow or broken, with times.
- `docs/ai-workflow.md`: how AI was used, one entry per session.
- `docs/runbook.md`: environments, credentials, deploy and rollback.

## Built with

First time with: Module Federation, Zephyr, Rspack, Biome. Used before: React and TypeScript daily; Webpack early on, then mostly esbuild; Vite and Vitest a little. I learned the first four from the Zephyr docs and the installed plugin's source, with an AI assistant (see `docs/ai-workflow.md`).

## Known limits

- Rollback goes only to the immediately previous version, and the docs describe it in the dashboard only. The dashboard calls the button "Redeploy" where the docs say "Rollback".
- In my run, `latest` only followed new deploys after I deleted the tag Zephyr creates by itself (`web_latest_<username>`). Whether that is needed for everyone is untested.
- Deploys are manual: CI does not deploy. Zephyr documents a CI token (`ZE_CI_TOKEN`); it is not set up here.
- Whether a brand-new remote, unknown to an already-built host, can be loaded without rebuilding the host is untested.
- Not tested in a browser by automation: the checks cover config and components, and the federation itself was checked by hand.
- The types in `apps/host/src/remote.d.ts` mirror the remote's by hand.

## Next steps

- A second remote, to show build order and the difference between a new version and a new remote.
- An Nx workspace like Zephyr's recipe, once there are enough apps to need it.
- CI deploy with a Zephyr CI token, and a browser test of the host with the remote down.
- Generate the remote's types (`dts`) instead of mirroring them by hand.
