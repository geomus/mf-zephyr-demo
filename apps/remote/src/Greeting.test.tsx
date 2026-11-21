import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Greeting, { RELEASE } from "./Greeting";

describe("Greeting", () => {
  it("shows the release number so a new version is visible in the host", () => {
    expect(renderToString(<Greeting />)).toContain(`Remote release ${RELEASE}`);
  });
});
