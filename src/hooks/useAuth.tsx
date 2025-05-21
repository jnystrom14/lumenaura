
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logWithEmoji, logError, logWarning } from '@/utils/consoleLogger';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logWithEmoji(`Auth state change event: ${event}`, 'info');
        setSession(session);
        setUser(session?.user ?? null);
        
        // Reset isLoggedOut flag if user logs back in
        if (event === 'SIGNED_IN') {
          setIsLoggedOut(false);
        } else if (event === 'SIGNED_OUT') {
          // Explicitly set logged out state
          setSession(null);
          setUser(null);
          setIsLoggedOut(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logWithEmoji(`Initial session check: ${session ? "Logged in" : "No session"}`, 'info');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
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

  return {
    user,
    session,
    loading,
    isLoggedOut,
    setIsLoggedOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };
}
