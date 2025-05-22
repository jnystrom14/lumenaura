
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logWithEmoji, logError, logWarning } from '@/utils/consoleLogger';
import { fetchUserProfile } from '@/services/profileService'; // Import the new service

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Overall auth loading
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false); // Profile specific loading
  const [isProfileReady, setIsProfileReady] = useState<boolean | null>(null); // Profile readiness

  const checkAndSetUserProfileStatus = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsProfileReady(null); // No user, so profile status is not applicable
      setIsLoadingProfile(false);
      return;
    }

    logWithEmoji('🕵️ Checking user profile status...', 'info');
    setIsLoadingProfile(true);
    setIsProfileReady(null); // Reset while checking

    try {
      const profile = await fetchUserProfile(currentUser.id);
      if (profile && profile.name && profile.birthDay && profile.birthMonth && profile.birthYear) { // Basic completeness check
        setIsProfileReady(true);
        logWithEmoji('✅ User profile is ready.', 'success');
      } else {
        setIsProfileReady(false);
        logWithEmoji('⏳ User profile not complete or found. May require onboarding.', 'info');
      }
    } catch (error) {
      logError(error, "Error fetching user profile status");
      setIsProfileReady(false); // Treat error as profile not ready
      setAuthError("Could not verify profile status. Please try again.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logWithEmoji(`🔔 Auth state change event: ${event}`, 'info');
        if (session) {
          // Log session details (e.g., user ID, expiry) carefully, avoid logging sensitive tokens directly in production
          logWithEmoji(`📬 Session object received. User: ${session.user?.id}, Expires at: ${new Date(session.expires_at * 1000).toLocaleString()}`, 'debug');
        } else {
          logWithEmoji('📬 No session object received with this event.', 'debug');
        }

        if (!isMounted) {
          logWarning(`🚫 Component unmounted. Skipping state update for event: ${event}`);
          return;
        }

        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            setAuthError(null);
            setIsLoggedOut(false);
            logWithEmoji('✅ User successfully signed in. Local state updated.', 'success');
            if (session?.user) {
              checkAndSetUserProfileStatus(session.user);
            }
            if (session?.provider_token) { // No need to log provider_refresh_token, it's sensitive
              logWithEmoji('🔑 OAuth provider token present in session.', 'debug');
            }
            break;
          case 'SIGNED_OUT':
            // Reset profile status on sign out
            setIsProfileReady(null);
            setIsLoadingProfile(false);
            setSession(null);
            setUser(null);
            setIsLoggedOut(true);
            setAuthError(null); // Explicitly clear auth error on clean sign-out
            logWithEmoji('🚪 User successfully signed out. Local state updated.', 'info');
            break;
          case 'USER_UPDATED':
            if (session) {
              setUser(session.user ?? null);
              logWithEmoji('👤 User profile updated. Local user state refreshed.', 'info');
            } else {
              logWarning('👤 USER_UPDATED event received without a session object. User state not updated.');
            }
            break;
          case 'TOKEN_REFRESHED':
            if (session) {
              setSession(session);
              setUser(session.user ?? null);
              setAuthError(null); // Clear any previous errors if refresh is successful
              setIsLoggedOut(false); // Ensure user is marked as logged in
              logWithEmoji('🔄 Auth token successfully refreshed. Local session updated.', 'info');
            } else {
              // This is critical: token refresh failed, user is effectively logged out
              setSession(null);
              setUser(null);
              setIsLoggedOut(true);
              setAuthError("Your session has expired or token refresh failed. Please sign in again.");
              logError(new Error('Token refresh failed, session is null.'), 'TOKEN_REFRESHED event indicated failed refresh. User logged out.');
            }
            break;
          case 'PASSWORD_RECOVERY':
            setAuthError(null); // Clear errors as user is in a recovery flow
            logWithEmoji('🔑 Password recovery event detected. Auth errors cleared.', 'info');
            break;
          default:
            logWithEmoji(`❓ Unhandled auth event: ${event}. Session: ${session ? 'exists' : 'null'}`, 'debug');
            // Fallback: Update session and user, clear error, as a general safe measure
            // This might be too broad, but ensures some level of state sync for unknown events.
            // Consider removing if strict handling per event is preferred.
            setSession(session);
            setUser(session?.user ?? null);
            setAuthError(null);
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
        if (session?.user) {
          checkAndSetUserProfileStatus(session.user);
        } else {
          // No user in initial session, means not logged in.
          // Profile status isn't applicable yet, ensure loading is false.
          setIsLoadingProfile(false);
        }
        setLoading(false); // Overall auth loading finished
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
      // Using window.location.origin + window.location.pathname ensures a clean base URL.
      const redirectBaseUrl = window.location.origin + window.location.pathname;
      
      // Log the redirect URL for debugging
      logWithEmoji(`Google auth redirect base URL: ${redirectBaseUrl}`, 'info');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectBaseUrl,
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
    logWithEmoji("🚀 Starting logout process", 'info');
    
    // Set this early to reflect immediate intent, additional sets in finally ensure it.
    logWithEmoji("➡️ Setting isLoggedOut to true (early)", 'info');
    setIsLoggedOut(true); 

    try {
      logWithEmoji("📡 Attempting Supabase server-side sign out...", 'info');
      const { error } = await supabase.auth.signOut();

      if (error) {
        if (error.message.includes("Session not found")) {
          logWarning("Supabase: Session not found on server during logout. Session may have already expired or been invalidated. Proceeding with local logout.");
        } else {
          logError(error, "Error during Supabase server-side sign out. Proceeding with local logout.");
        }
      } else {
        logWithEmoji("✅ Supabase server-side sign out successful", 'success');
      }

    } catch (signOutError: any) {
      logError(signOutError, "Exception during Supabase sign out attempt. Proceeding with local logout.");
    } finally {
      logWithEmoji("🧹 Clearing local authentication state (finally block)...", 'info');
      
      logWithEmoji("➡️ Setting session to null", 'info');
      setSession(null);
      logWithEmoji("➡️ Setting user to null", 'info');
      setUser(null);
      logWithEmoji("➡️ Ensuring isLoggedOut is true (finally)", 'info');
      setIsLoggedOut(true); // Ensure it's true

      logWithEmoji("🗑️ Attempting to clear authentication tokens from localStorage...", 'info');
      try {
        const mainAuthTokenKey = 'sb-bpolzfohirmqkmvubjzo-auth-token'; // Default Supabase key structure
        const legacyTokenKey = 'supabase.auth.token'; // Potentially legacy or alternative key

        logWithEmoji(`Attempting to remove localStorage key: '${mainAuthTokenKey}'`, 'info');
        if (localStorage.getItem(mainAuthTokenKey)) {
          localStorage.removeItem(mainAuthTokenKey);
          logWithEmoji(`✅ Removed '${mainAuthTokenKey}' from localStorage`, 'info');
        } else {
          logWarning(`⚠️ Key '${mainAuthTokenKey}' not found in localStorage`);
        }

        logWithEmoji(`Attempting to remove localStorage key: '${legacyTokenKey}'`, 'info');
        if (localStorage.getItem(legacyTokenKey)) {
          localStorage.removeItem(legacyTokenKey);
          logWithEmoji(`✅ Removed '${legacyTokenKey}' from localStorage`, 'info');
        } else {
          logWarning(`⚠️ Key '${legacyTokenKey}' not found in localStorage`);
        }

      } catch (storageError: any) {
        logError(storageError, "Error removing authentication tokens from localStorage.");
      }

      logWithEmoji("🏁 Sign out process completed locally.", 'success');
    }

    // Return a consistent success response because local logout is the goal.
    return { success: true, error: null };
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
    isLoadingProfile, // expose new state
    isProfileReady,   // expose new state
    clearAuthError,
    isSamsungBrowser: isSamsungBrowser(),
    setIsLoggedOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };
}
