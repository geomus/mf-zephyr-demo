// Bump on every remote release so a new version and a rollback are visible in the host.
export const RELEASE = 2;

export default function Greeting() {
  return (
    <section
      aria-labelledby="remote-greeting-title"
      style={{ border: "2px dashed #2563eb", borderRadius: 8, padding: "1rem" }}
    >
      <h2 id="remote-greeting-title">Hello from the remote</h2>
      <p>{`Remote release ${RELEASE}`}</p>
    </section>
  );
}
