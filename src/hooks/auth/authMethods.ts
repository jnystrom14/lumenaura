
import { supabase } from '@/integrations/supabase/client';
import { logWithEmoji, logError } from '@/utils/consoleLogger';
import { clearLocalStorageAuth } from './authUtils';
import { AuthResult } from './types';

/**
 * Signs in a user with email and password
 */
export const signInWithEmail = async (
  email: string, 
  password: string,
  setAuthError: (error: string | null) => void
): Promise<AuthResult> => {
  try {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    setAuthError(error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Signs up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string,
  setAuthError: (error: string | null) => void
): Promise<AuthResult> => {
  try {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    setAuthError(error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Signs in a user with Google OAuth
 */
export const signInWithGoogle = async (
  setAuthError: (error: string | null) => void
): Promise<AuthResult> => {
  try {
    setAuthError(null);
    
    // Get current URL to handle mobile vs desktop environments 
    const redirectUrl = new URL(window.location.href);
    redirectUrl.search = ''; // Remove any query parameters
    redirectUrl.hash = ''; // Remove any hash
    
    // Log the redirect URL for debugging
    logWithEmoji(`Google auth redirect URL: ${redirectUrl.toString()}`, 'info');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
        skipBrowserRedirect: false,
        queryParams: {
          // Add access_type and prompt parameters for better mobile compatibility
          access_type: 'offline',
          prompt: 'select_account'
        }
      },
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    const errorMsg = error.message;
    logError(error, "Google sign in error");
    setAuthError(errorMsg);
    return { success: false, error: errorMsg };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (
  setIsLoggedOut: (value: boolean) => void,
  setSession: (session: null) => void,
  setUser: (user: null) => void
): Promise<AuthResult> => {
  try {
    // Immediately set local state to logged out
    logWithEmoji("Starting logout process", 'info');
    setIsLoggedOut(true);
    
    try {
      // Try to sign out via Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Handle known error types
        if (error.message.includes("Session not found")) {
          logWithEmoji("Session not found during logout. Session may have expired, continuing with local logout.", 'warning');
        } else {
          throw error;
        }
      }
      
      logWithEmoji("Supabase sign out attempt completed", 'info');
    } catch (signOutError: any) {
      // Log the error but continue with local logout
      logError(signOutError, "Sign out error");
    }
    
    // Force clear the session and user state regardless of server response
    logWithEmoji("Forcing local session cleanup", 'info');
    setSession(null);
    setUser(null);
    
    // Force clear any auth data from local storage to ensure clean logout state
    clearLocalStorageAuth();
    
    logWithEmoji("Sign out completed successfully", 'success');
    return { success: true, error: null };
  } catch (finalError: any) {
    // This should never happen as we catch errors above, but just in case
    logError(finalError, "Unhandled sign out error");
    return { success: false, error: finalError.message };
  }
};
