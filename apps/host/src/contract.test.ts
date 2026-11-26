import { describe, expect, it } from "vitest";
import { remoteFederation } from "../../remote/src/federation";

const sources = import.meta.glob("./**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

describe("host and remote agree", () => {
  it("the remote exposes every module the host imports", () => {
    const imported = new Set(
      Object.values(sources).flatMap((source) =>
        [...source.matchAll(/["']remote\/([^"']+)["']/g)].map((match) => `./${match[1]}`),
      ),
    );
    expect(imported.size).toBeGreaterThan(0);
    for (const name of imported) {
      expect(Object.keys(remoteFederation.exposes), name).toContain(name);
    }
  });
});
