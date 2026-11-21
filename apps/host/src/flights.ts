import type { Flight } from "remote/FlightStatusCard";

// Invented data in Argentine formats (made-up airline code and LV- registrations); the host passes it to the remote as props.
export const flights: Flight[] = [
  {
    code: "XX 1204",
    registration: "LV-XAB",
    from: "Buenos Aires (AEP)",
    to: "Córdoba (COR)",
    departure: "09:15",
    status: "on-time",
  },
  {
    code: "XX 2310",
    registration: "LV-XBC",
    from: "Mendoza (MDZ)",
    to: "Salta (SLA)",
    departure: "11:40",
    status: "delayed",
  },
  {
    code: "XX 3077",
    registration: "LV-XCD",
    from: "Bariloche (BRC)",
    to: "Buenos Aires (AEP)",
    departure: "14:05",
    status: "cancelled",
  },
];
