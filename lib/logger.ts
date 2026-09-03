type LogLevel = 'info' | 'warn' | 'error';
type LogContextValue = string | number | boolean | null;
type LogContext = Record<string, LogContextValue>;

const SENSITIVE_KEY = /(secret|token|password|authorization|cookie|api[_-]?key)/i;

function sanitizeContext(context: LogContext = {}) {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [key, SENSITIVE_KEY.test(key) ? '[REDACTED]' : value]),
  );
}

function write(level: LogLevel, event: string, context?: LogContext) {
  const payload = {
    level,
    event,
    ...(context ? { context: sanitizeContext(context) } : {}),
  };

  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
}

export const logger = {
  info(event: string, context?: LogContext) {
    write('info', event, context);
  },
  warn(event: string, context?: LogContext) {
    write('warn', event, context);
  },
  error(event: string, context?: LogContext) {
    write('error', event, context);
  },
};
