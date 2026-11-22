// Async boundary: lets Module Federation negotiate the shared React singleton before any React code runs.
import("./bootstrap").catch((error: unknown) => {
  // Without this, a failed startup leaves a blank page; rethrow so the console keeps the cause.
  document.body.textContent =
    "The app could not start. Reload the page, and check the browser console if it persists.";
  throw error;
});
