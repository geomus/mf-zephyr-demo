import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export function RemoteError({ message }: { message: string }) {
  return (
    <div role="alert">
      <p>
        <strong>The remote could not be loaded.</strong>
      </p>
      <p>Check that the remote is running or deployed and reachable, then reload.</p>
      <details>
        <summary>Technical details</summary>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message}</pre>
      </details>
    </div>
  );
}

// A failed remote must not blank the whole host page; React itself logs the caught error.
export class RemoteBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override render() {
    if (this.state.error) return <RemoteError message={this.state.error.message} />;
    return this.props.children;
  }
}
