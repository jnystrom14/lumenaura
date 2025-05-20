import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./types";
import {
  getUserProfile,
  hasUserProfile,
  saveUserProfile,     // ← new utility to write to localStorage
  clearUserProfile,
} from "./utils/storage";
import { fetchUserProfileFromServer } from "./utils/api";  // ← your API call
import { useAuth } from "./hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import Authentication from "./components/auth/Authentication";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const {
    user,
    loading: authLoading,
    isLoggedOut,
    setIsLoggedOut,
    signOut,
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    // 1) Explicit logout
    if (isLoggedOut) {
      setShowAuth(true);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    // 2) LocalStorage profile exists → restore and go to Dashboard
    if (hasUserProfile()) {
      setUserProfile(getUserProfile()!);
      setShowAuth(false);
      setLoading(false);
      return;
    }

    // 3) Authenticated but no local profile → try fetch from server
    if (user) {
      setLoading(true);
      fetchUserProfileFromServer(user.id)
        .then((profile) => {
          // Save for future visits
          saveUserProfile(profile);
          setUserProfile(profile);
          setShowAuth(false);
        })
        .catch(() => {
          // No saved profile remotely → first‐time user
          setShowAuth(true);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // 4) Not authenticated → show login
    setShowAuth(true);
    setLoading(false);
  }, [user, authLoading, isLoggedOut]);

  // Reset the logout flag once we show the login screen
  useEffect(() => {
    if (showAuth && isLoggedOut) {
      setIsLoggedOut(false);
    }
  }, [showAuth, isLoggedOut, setIsLoggedOut]);

  const handleOnboardingComplete = () => {
    // After they finish onboarding, we assume you write to your server
    // then fetch the fresh profile into localStorage:
    const profile = getUserProfile();
    setUserProfile(profile);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsLoggedOut(true);
    clearUserProfile();
    setUserProfile(null);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-lg">Loading LumenAura...</p>
        </div>
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
              onContinueWithoutAccount={() => setShowAuth(false)}
              defaultToSignUp={false}
            />
          ) : user && !userProfile && !isLoggedOut ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
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
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
