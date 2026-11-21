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
- **Selector, 2026-11-21:** `remote@latest` failed on the first host deploy (`ZE40003`, cannot resolve the app and version), because the only tag Zephyr created for the remote was `web_latest_<username>`, not `latest`. Now `remote@*` (any published version, newest wins), which needs no dashboard setup and works for whoever clones the repo. A named tag or environment (for example `production`) is what the demo's rollback story will use. Unverified: how `*` moves when a new remote version is deployed; step 7 tests it.

## 2026-11-21 · Skeleton simplified

- Removed `src/lib/env.ts`, `src/lib/logger.ts`, their tests and `zod`. There is no server, and our code reads no env vars. The browser reports a failed remote with `console.error` (one documented `biome-ignore`). Approved as a deviation from the requirements.
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
