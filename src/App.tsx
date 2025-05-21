
// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

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

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { user, loading: authLoading, isLoggedOut, setIsLoggedOut, signOut } =
    useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    console.log("Auth state changed:", { user, isLoggedOut });

    // 1) If they've explicitly hit "logout," show login screen
    if (isLoggedOut) {
      setShowAuth(true);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    // 2) If we have a saved profile locally, go straight to Dashboard
    if (user && hasUserProfile()) {
      setUserProfile(getUserProfile());
      setShowAuth(false);
      setLoading(false);
      return;
    }

    // 3) If authenticated but no local profile, fetch from server
    if (user) {
      setLoading(true);
      fetchUserProfileFromServer(user.id)
        .then((profile) => {
          saveUserProfile(profile);
          setUserProfile(profile);
          setShowAuth(false);
        })
        .catch(() => {
          // truly first-time user: run onboarding
          setShowAuth(true);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // 4) Not authenticated: show login
    setShowAuth(true);
    setLoading(false);
  }, [user, authLoading, isLoggedOut]);

  // After showing login, clear the "logged out" flag
  useEffect(() => {
    if (showAuth && isLoggedOut) {
      setIsLoggedOut(false);
    }
  }, [showAuth, isLoggedOut, setIsLoggedOut]);

  const handleOnboardingComplete = () => {
    // Onboarding should save to your server & localStorage
    const profile = getUserProfile();
    setUserProfile(profile);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    console.log("Handling logout");
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
      console.error("Logout error:", result.error);
    } else {
      console.log("Logout successful");
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
