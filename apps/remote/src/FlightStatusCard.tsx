import { RELEASE } from "./release";
import StatusBadge, { type FlightStatus } from "./StatusBadge";

// The host owns the data and passes it in. Keep apps/host/src/remote.d.ts in step with this type.
export type Flight = {
  code: string;
  from: string;
  to: string;
  departure: string;
  status: FlightStatus;
};

export default function FlightStatusCard({ flight }: { flight: Flight }) {
  const titleId = `flight-${flight.code}`;
  return (
    <article
      aria-labelledby={titleId}
      style={{ border: "2px dashed #2563eb", borderRadius: 8, padding: "1rem", maxWidth: 360 }}
    >
      <h3 id={titleId} style={{ margin: 0 }}>
        {flight.code}
      </h3>
      <p>{`${flight.from} to ${flight.to}, departs ${flight.departure}`}</p>
      <StatusBadge status={flight.status} />
      <p style={{ fontSize: "0.75rem", marginBottom: 0 }}>{`Remote release ${RELEASE}`}</p>
    </article>
  );
}
