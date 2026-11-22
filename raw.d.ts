// Vitest can import a file's text with the ?raw suffix; this tells TypeScript the result is a string.
declare module "*?raw" {
  const content: string;
  export default content;
}
