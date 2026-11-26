// Vitest can import a file's text with the ?raw suffix; this tells TypeScript the result is a string.
declare module "*?raw" {
  const content: string;
  export default content;
}

// Vite's import.meta.glob, typed only for the eager ?raw form the tests use (vite's own types are not reachable from the root).
interface ImportMeta {
  glob(
    pattern: string,
    options: { query: "?raw"; import: "default"; eager: true },
  ): Record<string, string>;
}
