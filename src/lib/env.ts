import { z } from "zod";

// Extend per project. Keep every key in .env.example and docs/runbook.md.
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

export class EnvError extends Error {
  override name = "EnvError";
}

// Pure: pass process.env (Node) or the Worker `env` binding object. Fails fast with every invalid key listed.
export function parseEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new EnvError(`Invalid environment:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
