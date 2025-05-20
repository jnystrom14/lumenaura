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
  clearUserProfile,
} from "./utils/storage";
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
    signOut,            // ← make sure this comes from your useAuth hook
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const { toast } = useToast();

  // React to auth state or explicit logout
  useEffect(() => {
    if (authLoading) return;

    // If we’ve explicitly logged out, show the login screen
    if (isLoggedOut) {
      setShowAuth(true);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    // If we have a saved profile, restore it
    if (hasUserProfile()) {
      setUserProfile(getUserProfile()!);
      setLoading(false);
      return;
    }

    // Otherwise, decide based on whether the provider says we’re signed in
    if (user) {
      setShowAuth(false);
    } else {
      setShowAuth(true);
    }
    setLoading(false);
  }, [user, authLoading, isLoggedOut]);

  // After showing the auth screen, reset the logout flag
  useEffect(() => {
    if (showAuth && isLoggedOut) {
      setIsLoggedOut(false);
    }
  }, [showAuth, isLoggedOut, setIsLoggedOut]);

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
  };

  // ——— LOGOUT FIX ———
  const handleLogout = async () => {
    // 1) Tell your auth provider to sign out
    await signOut();

    // 2) Signal our app that we’re logged out (so the effect jumps to login)
    setIsLoggedOut(true);

    // 3) Wipe any saved profile
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
                    onLogout={handleLogout}  // ← logout now goes through our new flow
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
