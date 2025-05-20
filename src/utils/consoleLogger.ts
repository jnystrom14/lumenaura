
/**
 * Console logging utility with emoji prefixes
 * Helps track user journey and debug issues
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

const EMOJIS: Record<LogLevel, string> = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  error: '🔴',
  debug: '🔍'
};

/**
 * Log a message with an emoji prefix
 * @param message - The message to log
 * @param level - Log level that determines which emoji to use
 * @param data - Optional data to log alongside the message
 */
export const logWithEmoji = (
  message: string, 
  level: LogLevel = 'info', 
  data?: any
): void => {
  const emoji = EMOJIS[level];
  const formattedMessage = `${emoji} ${message}`;
  
  if (data !== undefined) {
    console.log(formattedMessage, data);
  } else {
    console.log(formattedMessage);
  }
};

/**
 * Log user journey step
 * @param step - The current step in the user journey
 * @param details - Optional details about the current step
 */
export const logUserJourney = (
  step: string,
  details?: any
): void => {
  logWithEmoji(`User Journey: ${step}`, 'info', details);
};

/**
 * Log API or edge function call
 * @param functionName - The name of the function being called
 * @param details - Optional details about the function call
 */
export const logFunctionCall = (
  functionName: string,
  details?: any
): void => {
  logWithEmoji(`Function Call: ${functionName}`, 'debug', details);
};

/**
 * Log successful operation
 * @param operation - The operation that succeeded
 * @param details - Optional details about the operation
 */
export const logSuccess = (
  operation: string,
  details?: any
): void => {
  logWithEmoji(`Success: ${operation}`, 'success', details);
};

/**
 * Log error
 * @param error - The error that occurred
 * @param context - Optional context about where the error occurred
 */
export const logError = (
  error: string | Error,
  context?: string
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  const contextInfo = context ? ` [${context}]` : '';
  logWithEmoji(`Error${contextInfo}: ${errorMessage}`, 'error', error instanceof Error ? error : undefined);
};

/**
 * Log warning
 * @param warning - The warning message
 * @param details - Optional details about the warning
 */
export const logWarning = (
  warning: string,
  details?: any
): void => {
  logWithEmoji(`Warning: ${warning}`, 'warning', details);
};
