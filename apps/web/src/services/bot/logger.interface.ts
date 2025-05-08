/**
 * Logger interface for @igniter-js/messaging
 *
 * Implement this interface to provide custom logging for your bot.
 * Supports multiple log levels and context for better traceability.
 */
export interface Logger {
  /**
   * Logs a standard message.
   * @param message The message to log.
   * @param context Optional context (e.g., module or class name).
   */
  log(message: string, context?: string): void;
  /**
   * Logs an error message.
   * @param message The error message.
   * @param trace Optional stack trace or additional details.
   * @param context Optional context.
   */
  error(message: string, trace?: string, context?: string): void;
  /**
   * Logs a warning message.
   * @param message The warning message.
   * @param context Optional context.
   */
  warn(message: string, context?: string): void;
  /**
   * Logs a debug message.
   * @param message The debug message.
   * @param context Optional context.
   */
  debug?(message: string, context?: string): void;
  /**
   * Logs a verbose message.
   * @param message The verbose message.
   * @param context Optional context.
   */
  verbose?(message: string, context?: string): void;
}
