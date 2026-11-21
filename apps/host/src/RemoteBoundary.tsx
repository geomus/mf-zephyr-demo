import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export function RemoteError({ message }: { message: string }) {
  return (
    <div role="alert">
      <p>
        <strong>The remote could not be loaded.</strong>
      </p>
      <p>{message}</p>
      <p>Check that the remote is running or deployed and reachable, then reload.</p>
    </div>
  );
}

// A failed remote must not blank the whole host page.
export class RemoteBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: Error) {
    // biome-ignore lint/suspicious/noConsole: static browser app with no log backend; the console is where this is debugged
    console.error("Remote failed to load", error);
  }

  override render() {
    if (this.state.error) return <RemoteError message={this.state.error.message} />;
    return this.props.children;
  }
}
