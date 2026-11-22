import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { type Configuration, HtmlRspackPlugin } from "@rspack/core";
import { remoteFederation } from "./src/federation.ts";

// Set by the Rspack CLI: RSPACK_SERVE for `rspack serve`, zephyr for `--env zephyr`.
type CliEnv = { RSPACK_SERVE?: boolean; zephyr?: boolean };

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Remote</title>
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
    // "auto" resolves chunk URLs from wherever remoteEntry.js was served, local or Zephyr.
    output: { publicPath: "auto", uniqueName: "remote", clean: true },
    devServer: { port: 3001, headers: { "Access-Control-Allow-Origin": "*" } },
    plugins: [
      new HtmlRspackPlugin({ templateContent: html }),
      new ModuleFederationPlugin(remoteFederation),
    ],
  };

  // Deploy is opt-in (`pnpm zephyr`); imported only here because loading the plugin creates ~/.zephyr even with ZE_DISABLED=true.
  if (env.zephyr !== true) return config;
  const { withZephyr } = await import("zephyr-rspack-plugin");
  return withZephyr()(config);
};
