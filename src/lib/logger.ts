export type LogLevel = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const rank: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface Logger {
  debug(msg: string, fields?: Fields): void;
  info(msg: string, fields?: Fields): void;
  warn(msg: string, fields?: Fields): void;
  error(msg: string, fields?: Fields): void;
  child(fields: Fields): Logger;
}

export type Sink = (line: string) => void;

// biome-ignore lint/suspicious/noConsole: the logger is the only place allowed to write to stdout
const stdoutSink: Sink = (line) => console.log(line);

function serializeError(value: unknown): unknown {
  if (!(value instanceof Error)) return value;
  return { name: value.name, message: value.message, stack: value.stack };
}

// One JSON line per event. Always pass a correlationId in base fields so logs and error reports can be joined.
export function createLogger(
  base: Fields = {},
  minLevel: LogLevel = "info",
  sink: Sink = stdoutSink,
): Logger {
  const write = (level: LogLevel, msg: string, fields: Fields = {}) => {
    if (rank[level] < rank[minLevel]) return;
    const entry: Fields = { ts: new Date().toISOString(), level, msg, ...base };
    for (const [key, value] of Object.entries(fields)) entry[key] = serializeError(value);
    sink(JSON.stringify(entry));
  };
  return {
    debug: (msg, fields) => write("debug", msg, fields),
    info: (msg, fields) => write("info", msg, fields),
    warn: (msg, fields) => write("warn", msg, fields),
    error: (msg, fields) => write("error", msg, fields),
    child: (fields) => createLogger({ ...base, ...fields }, minLevel, sink),
  };
}
