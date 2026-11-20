import { describe, expect, it } from "vitest";
import { createLogger } from "./logger";

const capture = () => {
  const lines: Record<string, unknown>[] = [];
  return { lines, sink: (line: string) => lines.push(JSON.parse(line)) };
};

describe("createLogger", () => {
  it("writes one JSON line with base fields and correlationId", () => {
    const { lines, sink } = capture();
    createLogger({ correlationId: "abc" }, "info", sink).info("order.created", { orderId: 7 });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      level: "info",
      msg: "order.created",
      correlationId: "abc",
      orderId: 7,
    });
  });

  it("drops events below the minimum level", () => {
    const { lines, sink } = capture();
    createLogger({}, "warn", sink).info("ignored");
    expect(lines).toHaveLength(0);
  });

  it("serializes errors and merges child fields", () => {
    const { lines, sink } = capture();
    createLogger({ app: "x" }, "debug", sink)
      .child({ step: "pay" })
      .error("failed", { err: new Error("boom") });
    expect(lines[0]).toMatchObject({
      app: "x",
      step: "pay",
      err: { name: "Error", message: "boom" },
    });
  });
});
