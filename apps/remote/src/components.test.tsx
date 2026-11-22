import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FlightStatusCard, { type Flight } from "./FlightStatusCard";
import { RELEASE } from "./release";
import StatusBadge, { type FlightStatus } from "./StatusBadge";

const flight: Flight = {
  code: "XX 1204",
  registration: "LV-XAB",
  from: "Buenos Aires (AEP)",
  to: "Córdoba (COR)",
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

  it("shows a status it does not know as text instead of crashing", () => {
    // A host deployed later can send a status this remote version does not know.
    for (const unknown of ["boarding", "constructor"]) {
      const html = renderToString(<StatusBadge status={unknown as FlightStatus} />);
      expect(html).toContain(unknown);
    }
  });
});

describe("FlightStatusCard", () => {
  const html = renderToString(<FlightStatusCard flight={flight} />);

  it("shows the flight, its route and its status", () => {
    expect(html).toContain("XX 1204");
    expect(html).toContain("Aircraft LV-XAB");
    expect(html).toContain("Buenos Aires (AEP) to Córdoba (COR)");
    expect(html).toContain("Delayed");
  });

  it("is labelled by its own heading, even when two cards show the same flight", () => {
    const twice = renderToString(
      <>
        <FlightStatusCard flight={flight} />
        <FlightStatusCard flight={flight} />
      </>,
    );
    const labels = [...twice.matchAll(/aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
    expect(labels).toHaveLength(2);
    expect(new Set(labels).size).toBe(2);
    for (const label of labels) expect(twice).toContain(`id="${label}"`);
  });

  it("shows the release number so a new version is visible in the host", () => {
    expect(html).toContain(`Remote release ${RELEASE}`);
  });
});
