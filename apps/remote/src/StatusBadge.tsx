export type FlightStatus = "on-time" | "delayed" | "cancelled";

// The status is always written out: color alone would not reach every reader.
const presentation: Record<FlightStatus, { label: string; color: string; background: string }> = {
  "on-time": { label: "On time", color: "#166534", background: "#dcfce7" },
  delayed: { label: "Delayed", color: "#854d0e", background: "#fef9c3" },
  cancelled: { label: "Cancelled", color: "#991b1b", background: "#fee2e2" },
};

export default function StatusBadge({ status }: { status: FlightStatus }) {
  const { label, color, background } = presentation[status];
  return (
    <span
      style={{
        color,
        background,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: "0.125rem 0.625rem",
        fontSize: "0.875rem",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}
