import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Greeting from "./Greeting";

// Standalone page so the remote can be opened and checked on its own.
const container = document.getElementById("root");
if (!container) throw new Error('Missing <div id="root"> in the HTML template');

createRoot(container).render(
  <StrictMode>
    <main>
      <h1>Remote (standalone)</h1>
      <Greeting />
    </main>
  </StrictMode>,
);
