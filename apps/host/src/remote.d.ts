// Mirrors the remote's exposes (apps/remote/src/federation.ts) and prop types; keep them in step by hand.
declare module "remote/StatusBadge" {
  import type { ComponentType } from "react";

  export type FlightStatus = "on-time" | "delayed" | "cancelled";
  const StatusBadge: ComponentType<{ status: FlightStatus }>;
  export default StatusBadge;
}

declare module "remote/FlightStatusCard" {
  import type { ComponentType } from "react";
  import type { FlightStatus } from "remote/StatusBadge";

  export type Flight = {
    code: string;
    from: string;
    to: string;
    departure: string;
    status: FlightStatus;
  };
  const FlightStatusCard: ComponentType<{ flight: Flight }>;
  export default FlightStatusCard;
}
