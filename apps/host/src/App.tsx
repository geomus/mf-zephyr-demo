import { lazy, Suspense } from "react";
import { flights } from "./flights";
import { RemoteBoundary } from "./RemoteBoundary";

// Fetched at runtime from the remote's entry, not bundled into the host.
const StatusBadge = lazy(() => import("remote/StatusBadge"));
const FlightStatusCard = lazy(() => import("remote/FlightStatusCard"));

export function App() {
  return (
    <main>
      <h1>Host</h1>
      <p>The dashed cards and the badges below are loaded at runtime from the remote app.</p>
      <RemoteBoundary>
        <Suspense fallback={<p>Loading the remote…</p>}>
          <p>
            Legend: <StatusBadge status="on-time" /> <StatusBadge status="delayed" />{" "}
            <StatusBadge status="cancelled" />
          </p>
          <h2>Departures</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
            {flights.map((flight) => (
              <li key={flight.code}>
                <FlightStatusCard flight={flight} />
              </li>
            ))}
          </ul>
        </Suspense>
      </RemoteBoundary>
    </main>
  );
}
