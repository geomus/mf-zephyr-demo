import { describe, expect, it } from "vitest";
import { remoteFederation } from "../../remote/src/federation";
import declarations from "./remote.d.ts?raw";

describe("host and remote agree", () => {
  it("the remote exposes every module the host declares in remote.d.ts", () => {
    const declared = [...declarations.matchAll(/declare module "remote\/([^"]+)"/g)].map(
      (match) => `./${match[1]}`,
    );
    expect(declared.length).toBeGreaterThan(0);
    for (const name of declared) {
      expect(Object.keys(remoteFederation.exposes), name).toContain(name);
    }
  });
});
