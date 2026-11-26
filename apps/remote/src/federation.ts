import type { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

type FederationOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0];

// Lives outside rspack.config.ts so the test checks the same expose map the build uses.
export const remoteFederation = {
  // Must equal package.json "name": Zephyr maps the MF name to the deployed app by it.
  name: "remote",
  filename: "remoteEntry.js",
  exposes: {
    "./StatusBadge": "./src/StatusBadge.tsx",
    "./FlightStatusCard": "./src/FlightStatusCard.tsx",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
  dts: {
    generateTypes: {
      tsConfigPath: "../../tsconfig.json",
      // Outside dist/ so output.clean keeps the unzipped types the host's tsconfig `paths` reads.
      outputDir: "types",
      deleteTypesFolder: false,
    },
    // The host reads the types from disk; downloading them needs the remote served over HTTP.
    consumeTypes: false,
  },
  // Keeps the dev bundle free of the types broker and live-reload entry dts would otherwise add.
  dev: false,
} satisfies FederationOptions;
