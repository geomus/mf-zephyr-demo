# mf-zephyr-demo

A small Module Federation setup deployed with [Zephyr Cloud](https://docs.zephyr-cloud.io/): a `host` app loads a `remote` app at runtime. Both are built with Rspack (React, TypeScript strict) and deployed through Zephyr's managed cloud. A new version of the remote reaches the already-deployed host without rebuilding the host.

```
apps/remote   exposes ./Greeting (shows "Remote release N")
apps/host     renders Greeting, loaded at runtime; shows an error message if the remote is down
```

## Run locally

Needs [mise](https://mise.jdx.dev) (Node 26, pnpm 11 are pinned in `mise.toml`).

```sh
mise install
pnpm install
pnpm dev          # remote on :3001, host on :3000
```

Open http://localhost:3000: the dashed box is the remote's component. Stop the remote and reload: the host stays up and shows "The remote could not be loaded."

Local runs never touch Zephyr: no login, no network, no `~/.zephyr`.

## Checks

```sh
pnpm check        # Biome, typecheck, tests, build of both apps
```

CI (`.github/workflows/ci.yml`) runs the same steps without any Zephyr credentials.

## Deploy with Zephyr

Deploying is opt-in: only `rspack build --env zephyr` loads the Zephyr plugin. Build the remote first, because the host resolves it at build time.

Needs a free Zephyr account, and a git repo with a branch, a commit and an `origin` remote (Zephyr derives the app name from them).

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

To ship a new remote version: change the remote, run `pnpm zephyr:remote`, reload the host. The host is not rebuilt. Rollback: in the dashboard, remote app, DevOps, Tags, `latest`, press **Redeploy** on the previous version, then reload the host (the change takes up to about a minute).

The URLs change with every deploy. A tag URL (dashboard, DevOps, Tags) stays the same while the tag moves between versions.

## Change it

- **Add an exposed module:** create `apps/remote/src/<Name>.tsx`, add `"./<Name>": "./src/<Name>.tsx"` to `exposes` in `apps/remote/src/federation.ts`, declare `remote/<Name>` in `apps/host/src/remote.d.ts`, and `lazy(() => import("remote/<Name>"))` in the host.
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

## Next steps

- A second remote, to show build order and the difference between a new version and a new remote.
- An Nx workspace like Zephyr's recipe, once there are enough apps to need it.
- CI deploy with a Zephyr CI token, and a browser test of the host with the remote down.
