import { lazy, Suspense } from "react";
import { RemoteBoundary } from "./RemoteBoundary";

// Fetched at runtime from the remote's entry, not bundled into the host.
const Greeting = lazy(() => import("remote/Greeting"));

export function App() {
  return (
    <main>
      <h1>Host</h1>
      <p>The dashed box below is loaded at runtime from the remote app.</p>
      <RemoteBoundary>
        <Suspense fallback={<p>Loading the remote…</p>}>
          <Greeting />
        </Suspense>
      </RemoteBoundary>
    </main>
  );
}
