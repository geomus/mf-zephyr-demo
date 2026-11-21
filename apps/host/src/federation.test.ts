import { describe, expect, it } from "vitest";
import { hostFederation, REMOTE_DEV_ENTRY, REMOTE_UNRESOLVED_ENTRY } from "./federation";

describe("host federation config", () => {
  it("points at the local remote only on the dev server", () => {
    expect(hostFederation(true).remotes.remote).toBe(REMOTE_DEV_ENTRY);
  });

  it("ships a placeholder that Zephyr must replace on every build", () => {
    expect(hostFederation(false).remotes.remote).toBe(REMOTE_UNRESOLVED_ENTRY);
  });

  it("keys the remote by the name Zephyr matches against zephyr:dependencies", () => {
    // Zephyr rewrites a remote only when its value starts with "<name>@".
    expect(REMOTE_UNRESOLVED_ENTRY.startsWith("remote@")).toBe(true);
  });

  it("shares React as a singleton so host and remote use one copy", () => {
    const { shared } = hostFederation(false);
    expect(shared.react.singleton).toBe(true);
    expect(shared["react-dom"].singleton).toBe(true);
  });

  it("does not fetch remotes before boot, so a remote down cannot blank the host", () => {
    expect(hostFederation(false).shareStrategy).toBe("loaded-first");
  });
});
