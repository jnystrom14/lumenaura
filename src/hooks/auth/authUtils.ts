
import { logWithEmoji, logWarning } from '@/utils/consoleLogger';

/**
 * Checks if the app is running in a Samsung browser
 * @returns boolean indicating if running in a Samsung browser
 */
export const isSamsungBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('samsung') || userAgent.includes('sm-');
};

/**
 * Helper to clean up local storage auth-related items
 */
export const clearLocalStorageAuth = (): void => {
  try {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-bpolzfohirmqkmvubjzo-auth-token');
  } catch (storageError) {
    logWarning("Could not clear local storage items");
  }
};

/**
 * Log messages about auth state changes
 * @param event Auth event name
 */
export const logAuthStateChange = (event: string): void => {
  if (event === 'SIGNED_IN') {
    logWithEmoji('User successfully signed in', 'success');
  } else if (event === 'SIGNED_OUT') {
    logWithEmoji('User signed out', 'info');
  } else if (event === 'USER_UPDATED') {
    logWithEmoji('User profile was updated', 'info');
  } else if (event === 'PASSWORD_RECOVERY') {
    logWithEmoji('Password recovery flow detected', 'info');
  } else if (event === 'TOKEN_REFRESHED') {
    logWithEmoji('Auth token was refreshed', 'info');
  }
};
