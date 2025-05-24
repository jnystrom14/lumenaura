import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logWithEmoji, logError } from '@/utils/consoleLogger';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from './authMethods';
import { isSamsungBrowser, logAuthStateChange } from './authUtils';
import { UseAuthReturn } from './types';

export function useAuthState(): UseAuthReturn {
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
        logWithEmoji(`Session exists: ${!!session}`, 'info');
        logWithEmoji(`User exists: ${!!session?.user}`, 'info');
        
        if (session?.user) {
          logWithEmoji(`User email: ${session.user.email}`, 'info');
          logWithEmoji(`User provider: ${session.user.app_metadata?.provider}`, 'info');
        }
        
        // Log URL parameters for debugging OAuth returns
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('access_token') || urlParams.has('code') || urlParams.has('error')) {
          logWithEmoji(`OAuth URL params detected: ${window.location.search}`, 'info');
        }
        
        if (!isMounted) return;
        
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null); // Clear any previous errors on successful auth events
        
        // Reset isLoggedOut flag if user logs back in
        if (event === 'SIGNED_IN') {
          logWithEmoji('Setting isLoggedOut to false', 'info');
          setIsLoggedOut(false);
        } else if (event === 'SIGNED_OUT') {
          // Explicitly set logged out state
          logWithEmoji('Setting isLoggedOut to true', 'info');
          setSession(null);
          setUser(null);
          setIsLoggedOut(true);
        }
        
        logAuthStateChange(event);
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

  // Method to clear auth error state
  const clearAuthError = () => setAuthError(null);

  return {
    user,
    session,
    loading,
    isLoggedOut,
    authError,
    clearAuthError,
    isSamsungBrowser: isSamsungBrowser(),
    setIsLoggedOut,
    signInWithEmail: (email: string, password: string) => signInWithEmail(email, password, setAuthError),
    signUpWithEmail: (email: string, password: string) => signUpWithEmail(email, password, setAuthError),
    signInWithGoogle: () => signInWithGoogle(setAuthError),
    signOut: () => signOut(setIsLoggedOut, setSession, setUser),
  };
}
