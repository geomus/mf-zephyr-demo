import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FlightStatusCard, { type Flight } from "./FlightStatusCard";
import { RELEASE } from "./release";
import StatusBadge, { type FlightStatus } from "./StatusBadge";

const flight: Flight = {
  code: "XA100",
  from: "Northport",
  to: "Eastvale",
  departure: "09:15",
  status: "delayed",
};

describe("StatusBadge", () => {
  it.each<[FlightStatus, string]>([
    ["on-time", "On time"],
    ["delayed", "Delayed"],
    ["cancelled", "Cancelled"],
  ])("writes the status out as text for %s", (status, label) => {
    expect(renderToString(<StatusBadge status={status} />)).toContain(label);
  });
});

describe("FlightStatusCard", () => {
  const html = renderToString(<FlightStatusCard flight={flight} />);

  it("shows the flight, its route and its status", () => {
    expect(html).toContain("XA100");
    expect(html).toContain("Northport to Eastvale");
    expect(html).toContain("Delayed");
  });

  it("is labelled by its heading", () => {
    expect(html).toContain('aria-labelledby="flight-XA100"');
    expect(html).toContain('id="flight-XA100"');
  });

  it("shows the release number so a new version is visible in the host", () => {
    expect(html).toContain(`Remote release ${RELEASE}`);
  });
});
