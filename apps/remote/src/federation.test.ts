import { describe, expect, it } from "vitest";
import { remoteFederation } from "./federation";

describe("remote federation config", () => {
  it("uses the package name the host and Zephyr refer to", () => {
    expect(remoteFederation.name).toBe("remote");
  });

  it("exposes the two modules the host loads", () => {
    expect(Object.keys(remoteFederation.exposes).sort()).toEqual([
      "./FlightStatusCard",
      "./StatusBadge",
    ]);
  });

  it("exposes only modules with a default component", async () => {
    for (const path of Object.values(remoteFederation.exposes)) {
      // Exposes are relative to the app root; this test sits in src/.
      const exposed = await import(/* @vite-ignore */ new URL(`../${path}`, import.meta.url).href);
      expect(typeof exposed.default, path).toBe("function");
    }
  });
});
