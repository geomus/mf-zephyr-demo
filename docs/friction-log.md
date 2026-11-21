# Friction log

Every point where docs or tooling were unclear, slow, broken or surprising. Times are ART (UTC-3). Factual, with a suggestion when there is one.

The agent ran in a sandbox with no access to the home folder. Some entries come from that setup, and those say so.

## 2026-11-20 · Reading the docs

- **I did not find a definition of "Default Cloud integration" in the docs I read.** The architecture page describes a "Managed Infrastructure Model" for "the default configuration", and the Cloudflare page says "default (managed)". The Cloudflare page also lets any custom integration be "Set as Default". _Suggestion:_ one sentence in the docs defining the default integration.
- **I did not find in the Quick start how you log in.** The first-app tutorial is where I read that a browser window opens on the first build. _Suggestion:_ say it in the Quick start, and say what happens when no browser is available (CI, containers).
- **Three different Module Federation imports** across the Rspack page (`@module-federation/enhanced/rspack`), the create-mf-app tutorial (`rspack.container.ModuleFederationPlugin`) and the MF guide (`ModuleFederationPluginV1`, shown without an import). The install step on the Rspack page I read does not include the enhanced package.
- **The MF guide has invalid snippets:** `remotes: ['post', follow']` is missing a quote and uses an array; a `json` block contains `name: 'post'`; the `package.json` examples in remote-dependencies contain `//` comments.
- **The Rspack page's host and remote disagree:** the host loads `mf-manifest.json`, but the remote sets `filename: 'remoteEntry.js'`, and I did not find on the page when the manifest is generated. The host's localhost URL appears as the remote URL, and I did not see a note that Zephyr replaces it on deploy.
- **I did not find an example of the `remotes` value to write** next to `zephyr:dependencies`. I found it by reading the plugin source, and the deploys confirmed it: the remote must be present in `remotes`, with a value starting with `<name>@`.
- **The docs contradict each other on `~/.zephyr`:** the first-app tutorial suggests `rm -rf ~/.zephyr`, and error ZE10018 says "Do not ... manually delete files from `~/.zephyr`".
- **The docs I read describe rollback in the dashboard only.** They mention rollbacks "through Zephyr's API", but I did not find an endpoint.

## 2026-11-21 · Building

- **16:10 · `ZE_DISABLED=true` still touches the home folder.** The plugin's type docs say "no Zephyr engine, no token, no git information, no network request". But importing `zephyr-agent` runs `ensurePrivateStoragePermissions()` at module load and creates `~/.zephyr`. In a sandbox without home access, the "disabled" build crashed with `EPERM: mkdir '~/.zephyr'`. _Workaround:_ the plugin is imported only for deploy builds (see decisions). _Suggestion:_ create storage lazily, only when Zephyr is enabled.
- **16:00 · Rspack 2 needs `@rspack/dev-server` as a separate install** for `rspack serve`. I did not see it in the install step of the Zephyr Rspack page. Not a Zephyr bug: an install step that could be added.
- **15:40 · pnpm 12 did not run inside the agent sandbox** (`ERR_PNPM_STORE_DIR_OPEN_OPERATION_LOCK`, "Operation not permitted") even with writable store and cache folders. pnpm 11.28.13 works. Sandbox-specific, not Zephyr.
- **18:30 · Module Federation's default share strategy blanks the host when a remote is down.** With `version-first`, the default, the runtime fetches the remotes' entries before boot (read in `@module-federation/runtime-core` 2.9.3, `shared/index.js:321`), so `Failed to get manifest #RUNTIME-003` came before React mounted and the host's error boundary never ran. Fixed with `shareStrategy: "loaded-first"`. Module Federation behavior, not Zephyr. _Suggestion for Zephyr's MF guide:_ mention it, since a host that follows a moving tag is a case where a remote can break.
- **17:55 · First `pnpm zephyr:remote`, run by me outside the sandbox.** It asked for a browser login, and the login worked. The build ran from a working tree with uncommitted changes, on top of a commit that did not contain the app yet. I did not keep the output of that first deploy, so I cannot say whether Zephyr warned about the uncommitted changes. I also deployed the host the same way. Afterwards I deleted the whole project from the dashboard, so the next deploys start from a clean commit.
- **16:28 · The agent sandbox blocks local port binding** (`listen EPERM 0.0.0.0:3000`), so the agent cannot run the dev servers. Sandbox-specific.
