import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { type Configuration, HtmlRspackPlugin } from "@rspack/core";
import { hostFederation } from "./src/federation.ts";

// Set by the Rspack CLI: RSPACK_SERVE for `rspack serve`, zephyr for `--env zephyr`.
type CliEnv = { RSPACK_SERVE?: boolean; zephyr?: boolean };

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Host</title>
  </head>
  <body style="font-family: system-ui, sans-serif; margin: 2rem">
    <div id="root"></div>
  </body>
</html>`;

export default async (env: CliEnv) => {
  const config: Configuration = {
    entry: "./src/index.ts",
    resolve: { extensions: [".ts", ".tsx", ".js"] },
    module: {
      rules: [
        {
          // TypeScript and JSX through Rspack's built-in SWC: no Babel or ts-loader.
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: { syntax: "typescript", tsx: true },
              transform: { react: { runtime: "automatic" } },
            },
          },
          type: "javascript/auto",
        },
      ],
    },
    output: { publicPath: "auto", uniqueName: "host", clean: true },
    devServer: { port: 3000 },
    plugins: [
      new HtmlRspackPlugin({ templateContent: html }),
      new ModuleFederationPlugin(hostFederation(env.RSPACK_SERVE === true)),
    ],
  };

  // Deploy is opt-in (`pnpm zephyr`); imported only here because loading the plugin creates ~/.zephyr even with ZE_DISABLED=true.
  if (env.zephyr !== true) return config;
  const { withZephyr } = await import("zephyr-rspack-plugin");
  return withZephyr()(config);
};
