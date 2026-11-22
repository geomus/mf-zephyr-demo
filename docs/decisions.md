# Decisions

What won, what lost, and why. Newest last.

## 2026-11-20 · Shape: one host, one remote

- **Won:** a host that loads one remote at runtime, both Rspack + React + TypeScript, in one pnpm workspace.
- **Lost:** an Nx monorepo from Zephyr's recipe (too much generated code to explain line by line; listed as a next step); a second remote (optional, only after the main demo is ready).
- **Why:** the smallest setup that still shows real Module Federation and Zephyr's version, tag and rollback flow.

## 2026-11-20 · Bundler: Rspack

- **Won:** Rspack 2 with its built-in SWC loader and HTML plugin.
- **Lost:** Webpack (I used it early on; Rspack keeps its config model with built-in SWC, so fewer loaders); esbuild (what I have used most, but it is not among the bundlers Zephyr lists as supported); Rsbuild and Vite (one more layer over the bundler config that Zephyr and Module Federation plug into).
- **Why:** Zephyr's Module Federation examples use Rspack.

## 2026-11-21 · Module Federation package: `@module-federation/enhanced/rspack`

- **Won:** the plugin shown on Zephyr's Rspack page.
- **Lost:** Rspack's built-in `container.ModuleFederationPlugin` (one dependency fewer; used by one Zephyr tutorial, not by the Rspack page); `ModuleFederationPluginV1` (shown in Zephyr's guide without an import).
- **Why:** it is the documented path for Zephyr + Rspack; it generates `mf-manifest.json`, which the host loads in dev.

## 2026-11-21 · Deploy is opt-in, not opt-out

- **Won:** a plain `rspack build` never imports the Zephyr plugin. Only `rspack build --env zephyr` (the `pnpm zephyr:*` scripts) wraps the config with `withZephyr()`.
- **Lost:** Zephyr's documented `ZE_DISABLED=true` switch on the normal scripts.
- **Why:** with `ZE_DISABLED=true`, importing the plugin still tried to create `~/.zephyr` and crashed the build in a sandbox without access to the home folder (see friction log). Opt-in also means a typo in a script cannot deploy by accident, and CI needs no Zephyr setting at all.

## 2026-11-21 · How the host finds the remote

- **Won:** `package.json` `"zephyr:dependencies": { "remote": "remote@latest" }`. In the MF config, the host has `localhost:3001` only on the dev server. Every build gets a placeholder at `unresolved-remote.invalid`, which the Zephyr plugin replaces with the resolved URL.
- **Lost:** a localhost URL in every build, as in Zephyr's Rspack example (a failed resolution would then deploy a host pointing at a developer's machine); runtime-only resolution (more code for the same result).
- **Why:** I read the installed plugin (`zephyr-xpack-internal` 1.8.0, `mut-webpack-federated-remotes-config`). From that code (read, then confirmed by the deploys), it rewrites a remote when the MF config already has that remote and its value starts with `<name>@`. The selector comes from `zephyr:dependencies`. A `.invalid` domain is reserved and does not resolve (RFC 2606), so a missed rewrite fails loudly in the host's error message.
- **Superseded** by "Remote selector: the `latest` tag" below: the first attempt, `remote@latest`, failed (`ZE40003`, no such tag) and `*` was frozen at build time.

## 2026-11-21 · Skeleton simplified

- Removed `src/lib/env.ts`, `src/lib/logger.ts`, their tests and `zod`. There is no server, and our code reads no env vars. A failed remote is logged by React itself: React 19 logs every error an error boundary catches (`defaultOnCaughtError`, read in the installed `react-dom`), so the app adds no logging of its own. Approved as a deviation from the requirements.
- The ADR folder (`docs/decisions/`) became this single file.
- No CSS framework: inline styles on two components. Tailwind would add a PostCSS toolchain for two boxes.
- Each app owns its `rspack.config.ts` (about 50 lines, some duplication). A shared root config could not resolve the apps' dependencies, and each app deploys on its own.

## 2026-11-21 · Package manager: pnpm 11.28.13

- **Won:** pnpm 11, pinned in `packageManager` and `mise.toml`.
- **Lost:** pnpm 12.21 (the latest).
- **Why:** pnpm 12 could not take its store lock inside the agent sandbox (`ERR_PNPM_STORE_DIR_OPEN_OPERATION_LOCK`), and pnpm 11 works there. Revisit when the sandbox or pnpm changes.

## 2026-11-21 · Host share strategy: `loaded-first`

- **Won:** `shareStrategy: "loaded-first"` in the host. A remote is fetched only when its component renders, so the error boundary can show a failed remote.
- **Lost:** the default `"version-first"`. It loads the remotes' entries before the host boots, to pick the highest shared version (read in `@module-federation/runtime-core` 2.9.3, and seen in dev). With the remote down, the host page stayed blank and the error boundary never mounted.
- **Why:** with one host and a pinned React, the version negotiation buys nothing, and a host that survives a broken remote is the point of the error boundary. Found by stopping the remote in dev. The cause is in `@module-federation/runtime-core` 2.9.3, `shared/index.js:321`.
- **Trade-off:** if host and remote ever ship different React versions, the host's copy wins instead of the highest one. Both are pinned to 19.3.1.

## 2026-11-21 · Remote selector: the `latest` tag

- **Won:** `"remote": "remote@latest"`, with a tag named `latest` created by hand in the dashboard (Branch is `main`, Target is Web, not locked).
- **Lost:** `remote@*` (in my run it resolved to one concrete version at host build time: the deploy wrote the remote's version-5 URL into the host's `zephyr-manifest.json`, and a new remote version did not reach the host); `remote@<version>` (fixed by definition, not tried); `remote@web_latest_<username>` (the tag Zephyr creates itself; it names a person, so nobody else can reproduce it).
- **Why:** a tag is the pointer that moves. With `latest`, the host resolves to `https://t-latest-remote-…zephyrcloud.app/remoteEntry.js`, which has no version in it.
- **Verified 2026-11-21, by hand:** deployed remote release 3, the already-deployed host showed release 3 without a rebuild; pressed Redeploy on the previous version in the tag's history, the host showed release 2 again. A deploy or redeploy takes up to about a minute to show.
- **Surprise:** `latest` only followed new deploys after the automatic `web_latest_<username>` tag was deleted. Until then the host kept the old version. Cause not confirmed.
- **Cost:** one manual dashboard step, between deploying the remote and deploying the host. Not scriptable from what the docs show.

## 2026-11-21 · A failed remote resolution does not fail the build

- **Won:** nothing extra. The host's placeholder URL (`.invalid`) makes an unresolved remote show up as an error in the page, and the README says to check that `pnpm zephyr:host` prints `Resolved remotes:`.
- **Lost:** `withZephyr({ failBuild: true })`. The option exists in `zephyr-rspack-plugin` 1.8.0, but from the installed code (read, not run) it only rethrows errors routed through the global error handler (configuration and upload failures). An unresolved remote is logged as a warning, so the option would not catch it.
- **Why:** a guard that looks like it works and does not is worse than none. Verified only by reading; I did not run a build with a missing remote and `failBuild`.

## 2026-11-21 · What the remote serves: a status badge and a flight status card

- **Won:** two exposed components, `StatusBadge` and `FlightStatusCard`. The host owns invented flight data and passes it in as props. The card shows "Remote release N".
- **Lost:** the first remote, a "Hello" component (nothing to explain about federation); a badge alone (smaller, but only one exposed module).
- **Why:** two exposes show the contract between host and remote (props typed in `apps/host/src/remote.d.ts`), a component library is what a shared UI remote is for, and adding a module or a variant is a small, safe live change. The theme is generic and the data is invented, in Argentine formats (airline code plus four digits, `LV-` registrations, domestic airports); the airline code and the registrations are made up. The release label is what makes a new version and a rollback visible.
- **Cost:** the host's types for the remote are written by hand and can drift. Generated types (`dts`) are the next step.

## 2026-11-21 · Tests: Vitest with `renderToString`, no DOM library

- **Won:** components are rendered to a string with `react-dom/server` and the output is checked. A test imports every exposed file and checks that it has a default component, so a broken expose fails `pnpm check`.
- **Lost:** jsdom and Testing Library (two more dependencies for a few components); a browser test (valuable, but needs a browser and a running remote).
- **Why:** the checks run anywhere, fast, with no setup. What they cannot see is the federation itself, which is why the README says it was checked by hand.
