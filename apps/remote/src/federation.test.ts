import { describe, expect, it } from "vitest";
import { remoteFederation } from "./federation";

describe("remote federation config", () => {
  it("uses the package name the host and Zephyr refer to", () => {
    expect(remoteFederation.name).toBe("remote");
  });

  it("exposes ./Greeting as a module with a default component", async () => {
    const path = remoteFederation.exposes["./Greeting"];
    // Exposes are relative to the app root; this test sits in src/.
    const exposed = await import(/* @vite-ignore */ new URL(`../${path}`, import.meta.url).href);
    expect(typeof exposed.default).toBe("function");
  });
});
