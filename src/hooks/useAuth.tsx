
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logWithEmoji, logError, logWarning } from '@/utils/consoleLogger';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logWithEmoji(`Auth state change event: ${event}`, 'info');
        
        if (!isMounted) return;
        
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null); // Clear any previous errors on successful auth events
        
        // Reset isLoggedOut flag if user logs back in
        if (event === 'SIGNED_IN') {
          setIsLoggedOut(false);
          logWithEmoji('User successfully signed in', 'success');
        } else if (event === 'SIGNED_OUT') {
          // Explicitly set logged out state
          setSession(null);
          setUser(null);
          setIsLoggedOut(true);
        } else if (event === 'USER_UPDATED') {
          logWithEmoji('User profile was updated', 'info');
        } else if (event === 'PASSWORD_RECOVERY') {
          logWithEmoji('Password recovery flow detected', 'info');
        } else if (event === 'TOKEN_REFRESHED') {
          logWithEmoji('Auth token was refreshed', 'info');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logError(error, "Error retrieving session");
        if (isMounted) setAuthError(error.message);
      }
      
      logWithEmoji(`Initial session check: ${session ? "Logged in" : "No session"}`, 'info');
      
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
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

  const signUpWithEmail = async (email: string, password: string) => {
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

  const signInWithGoogle = async () => {
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

  const signOut = async () => {
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
            logWarning("Session not found during logout. Session may have expired, continuing with local logout.");
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
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-bpolzfohirmqkmvubjzo-auth-token');
      } catch (storageError) {
        logWarning("Could not clear local storage items");
      }
      
      logWithEmoji("Sign out completed successfully", 'success');
      return { success: true, error: null };
    } catch (finalError: any) {
      // This should never happen as we catch errors above, but just in case
      logError(finalError, "Unhandled sign out error");
      return { success: false, error: finalError.message };
    }
  };

  // Method to clear auth error state
  const clearAuthError = () => setAuthError(null);

  // Method to check if the app is running in a Samsung browser
  const isSamsungBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('samsung') || userAgent.includes('sm-');
  };

  return {
    user,
    session,
    loading,
    isLoggedOut,
    authError,
    clearAuthError,
    isSamsungBrowser: isSamsungBrowser(),
    setIsLoggedOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };
}
