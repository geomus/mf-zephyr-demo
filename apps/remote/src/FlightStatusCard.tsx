import { useId } from "react";
import { RELEASE } from "./release";
import StatusBadge, { type FlightStatus } from "./StatusBadge";

// The host owns the data and passes it in. Keep apps/host/src/remote.d.ts in step with this type.
export type Flight = {
  code: string; // airline code + number, for example "XX 1204"
  registration: string; // aircraft registration, for example "LV-ABC"
  from: string;
  to: string;
  departure: string; // local time, HH:MM
  status: FlightStatus;
};

export default function FlightStatusCard({ flight }: { flight: Flight }) {
  const titleId = useId();
  return (
    <article
      aria-labelledby={titleId}
      style={{ border: "2px dashed #2563eb", borderRadius: 8, padding: "1rem", maxWidth: 360 }}
    >
      <h3 id={titleId} style={{ margin: 0 }}>
        {flight.code}
      </h3>
      <p>{`${flight.from} to ${flight.to}, departs ${flight.departure}`}</p>
      <p>{`Aircraft ${flight.registration}`}</p>
      <StatusBadge status={flight.status} />
      <p style={{ fontSize: "0.75rem", marginBottom: 0 }}>{`Remote release ${RELEASE}`}</p>
    </article>
  );
}
