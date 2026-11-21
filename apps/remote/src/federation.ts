import type { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

type FederationOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0];

// Lives outside rspack.config.ts so the test checks the same expose map the build uses.
export const remoteFederation = {
  // Must equal package.json "name": Zephyr maps the MF name to the deployed app by it.
  name: "remote",
  filename: "remoteEntry.js",
  exposes: {
    "./Greeting": "./src/Greeting.tsx",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
  // shortcut: no generated remote types, the host declares the one module it uses; enable dts when the API grows.
  dts: false,
} satisfies FederationOptions;
