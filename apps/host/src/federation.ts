import type { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

type FederationOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0];

// Only `rspack serve` uses this: the remote's dev server on this machine.
export const REMOTE_DEV_ENTRY = "remote@http://localhost:3001/mf-manifest.json";

// Every build ships this placeholder; Zephyr replaces it on deploy, and if it cannot, the host shows an error (.invalid does not resolve).
export const REMOTE_UNRESOLVED_ENTRY = "remote@https://unresolved-remote.invalid/mf-manifest.json";

export function hostFederation(isDevServer: boolean) {
  return {
    name: "host",
    remotes: {
      remote: isDevServer ? REMOTE_DEV_ENTRY : REMOTE_UNRESOLVED_ENTRY,
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
    // The default "version-first" fetches remotes before boot, so a remote down blanks the page; "loaded-first" fetches on render.
    shareStrategy: "loaded-first",
    dts: false,
  } satisfies FederationOptions;
}
