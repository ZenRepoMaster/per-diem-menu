/**
 * Request Logger Utility
 * 
 * Provides structured logging for API requests with timing information.
 * Logs method, path, status code, and duration for each request.
 */

export interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number; // in milliseconds
  error?: string;
}

/**
 * Log levels for different types of messages
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Format a log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const statusIndicator = entry.statusCode >= 400 ? '[ERROR]' : '[OK]';
  const durationIndicator = entry.duration > 1000 ? '[SLOW]' : '[FAST]';
  
  return `[${entry.timestamp}] ${statusIndicator} ${entry.method} ${entry.path} - ${entry.statusCode} (${entry.duration}ms) ${durationIndicator}`;
}

/**
 * Logger class for request logging
 */
class RequestLogger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Log an API request
   */
  logRequest(entry: Omit<LogEntry, 'timestamp'>): void {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // In development, use formatted output
    if (this.isDevelopment) {
      console.log(formatLogEntry(fullEntry));
      
      if (fullEntry.error) {
        console.error(`  └─ Error: ${fullEntry.error}`);
      }
    } else {
      // In production, use JSON for structured logging
      console.log(JSON.stringify(fullEntry));
    }
  }

  /**
   * Log an info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    
    if (this.isDevelopment) {
      const prefix = {
        info: '[INFO]',
        warn: '[WARN]',
        error: '[ERROR]',
        debug: '[DEBUG]',
      }[level];
      
      console.log(`[${timestamp}] ${prefix} ${message}`);
      
      if (data) {
        console.log('  └─', data);
      }
    } else {
      console.log(JSON.stringify({
        timestamp,
        level,
        message,
        ...data,
      }));
    }
  }
}

// Export singleton instance
export const logger = new RequestLogger();

/**
 * Helper to measure request duration
 * Returns a function that calculates elapsed time when called
 */
export function startTimer(): () => number {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}
