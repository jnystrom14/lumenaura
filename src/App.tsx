// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { logWithEmoji } from "@/utils/consoleLogger";

import { useAuth } from "./hooks/useAuth";
import {
  getUserProfile,
  hasUserProfile,
  saveUserProfile,
  clearUserProfile,
} from "./utils/storage";
import { fetchUserProfileFromServer } from "./utils/api";

import Authentication from "./components/auth/Authentication";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { user, loading: authLoading, isLoggedOut, setIsLoggedOut, signOut, authError } =
    useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();

  // Log initial app state for debugging
  useEffect(() => {
    logWithEmoji("App mounted, initial state:", "info");
    logWithEmoji(`User authenticated: ${!!user}`, "info");
    logWithEmoji(`Auth loading: ${authLoading}`, "info");
    logWithEmoji(`Is logged out: ${isLoggedOut}`, "info");
    
    // Check for authentication parameters in URL that might indicate
    // a redirect back from an OAuth provider
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('access_token') || 
                          urlParams.has('refresh_token') ||
                          urlParams.has('provider') ||
                          urlParams.has('code');
    
    if (hasAuthParams) {
      logWithEmoji("Auth redirect detected in URL", "info");
    }
  }, []);

  // Main effect to handle authentication state changes
  useEffect(() => {
    if (authLoading) return;

    logWithEmoji("Auth state changed:", "info");
    logWithEmoji(`User: ${user ? "Logged in" : "Not logged in"}`, "info");
    logWithEmoji(`Is logged out flag: ${isLoggedOut}`, "info");

    // 1) If they've explicitly hit "logout," show login screen
    if (isLoggedOut) {
      setShowAuth(true);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    // 2) If we have a saved profile locally, go straight to Dashboard
    if (user && hasUserProfile()) {
      const profile = getUserProfile();
      logWithEmoji("Found cached user profile", "info");
      setUserProfile(profile);
      setShowAuth(false);
      setLoading(false);
      return;
    }

    // 3) If authenticated but no local profile, fetch from server
    if (user) {
      logWithEmoji("User authenticated, fetching profile...", "info");
      setLoading(true);
      fetchUserProfileFromServer(user.id)
        .then((profile) => {
          logWithEmoji("Profile fetched successfully", "success");
          saveUserProfile(profile);
          setUserProfile(profile);
          setShowAuth(false);
        })
        .catch((error) => {
          logWithEmoji(`Error fetching profile: ${error.message}`, "error");
          // truly first-time user: run onboarding
          setShowAuth(true);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // 4) Not authenticated: show login
    logWithEmoji("No authentication, showing login", "info");
    setShowAuth(true);
    setLoading(false);
  }, [user, authLoading, isLoggedOut]);

  // After showing login, clear the "logged out" flag
  useEffect(() => {
    if (showAuth && isLoggedOut) {
      setIsLoggedOut(false);
    }
  }, [showAuth, isLoggedOut, setIsLoggedOut]);

  // Show error toast if auth error exists
  useEffect(() => {
    if (authError) {
      toast({
        title: "Authentication Error",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, toast]);

  const handleOnboardingComplete = () => {
    // Onboarding should save to your server & localStorage
    const profile = getUserProfile();
    setUserProfile(profile);
    setShowAuth(false);
  };
  
  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  const handleLogout = async () => {
    logWithEmoji("Handling logout", "info");
    // Clear user data first
    clearUserProfile();
    setUserProfile(null);
    
    // Then trigger the sign out
    const result = await signOut();
    if (result.error) {
      toast({
        title: "Error during logout",
        description: result.error,
        variant: "destructive",
      });
      logWithEmoji(`Logout error: ${result.error}`, "error");
    } else {
      logWithEmoji("Logout successful", "success");
      // Force the logout state
      setIsLoggedOut(true);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {showAuth ? (
            <Authentication
              onContinueWithoutAccount={() => {}} // Empty function as we're removing this feature
              defaultToSignUp={false}
            />
          ) : user && !userProfile && !isLoggedOut ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : userProfile ? (
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    userProfile={userProfile}
                    onLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    userProfile={userProfile}
                    onProfileUpdate={handleProfileUpdate}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            // If no userProfile and not in other states, show authentication
            <Authentication
              onContinueWithoutAccount={() => {}} // Empty function as we're removing this feature
              defaultToSignUp={false}
            />
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
