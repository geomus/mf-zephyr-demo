import { describe, expect, it } from "vitest";
import { EnvError, parseEnv } from "./env";

describe("parseEnv", () => {
  it("applies defaults", () => {
    expect(parseEnv({})).toEqual({ NODE_ENV: "development", LOG_LEVEL: "info" });
  });

  it("lists invalid keys", () => {
    expect(() => parseEnv({ LOG_LEVEL: "loud" })).toThrow(EnvError);
    expect(() => parseEnv({ LOG_LEVEL: "loud" })).toThrow(/LOG_LEVEL/);
  });
});
