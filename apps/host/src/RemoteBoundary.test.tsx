import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RemoteBoundary, RemoteError } from "./RemoteBoundary";

describe("RemoteBoundary", () => {
  it("turns any thrown value into an Error for the fallback", () => {
    expect(RemoteBoundary.getDerivedStateFromError("boom").error?.message).toBe("boom");
  });

  it("renders an accessible, actionable fallback", () => {
    const html = renderToString(<RemoteError message="Failed to fetch remoteEntry.js" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain("Failed to fetch remoteEntry.js");
    expect(html).toContain("then reload");
  });
});
