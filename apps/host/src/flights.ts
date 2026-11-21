import type { Flight } from "remote/FlightStatusCard";

// Invented sample data: the host owns it and hands it to the remote's components as props.
export const flights: Flight[] = [
  { code: "XA100", from: "Northport", to: "Eastvale", departure: "09:15", status: "on-time" },
  { code: "XA214", from: "Eastvale", to: "Lakeside", departure: "11:40", status: "delayed" },
  { code: "XA307", from: "Lakeside", to: "Northport", departure: "14:05", status: "cancelled" },
];
