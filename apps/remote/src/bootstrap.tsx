import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FlightStatusCard from "./FlightStatusCard";

// Standalone page so the remote can be opened and checked on its own.
const container = document.getElementById("root");
if (!container) throw new Error('Missing <div id="root"> in the HTML template');

createRoot(container).render(
  <StrictMode>
    <main>
      <h1>Remote (standalone)</h1>
      <FlightStatusCard
        flight={{
          code: "XX 1204",
          registration: "LV-XAB",
          from: "Buenos Aires (AEP)",
          to: "Córdoba (COR)",
          departure: "09:15",
          status: "on-time",
        }}
      />
    </main>
  </StrictMode>,
);
