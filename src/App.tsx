import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./types";
import { getUserProfile, hasUserProfile, clearUserProfile } from "./utils/storage";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import Authentication from "./components/auth/Authentication";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, loading: authLoading, isLoggedOut, setIsLoggedOut } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle auth state changes
  useEffect(() => {
    if (authLoading) return;

    if (isLoggedOut) {
      setShowAuth(true);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    if (hasUserProfile()) {
      const profile = getUserProfile();
      setUserProfile(profile);
      setLoading(false);
      return;
    }

    if (user) {
      setShowAuth(false);
    } else {
      setShowAuth(true);
    }

    setLoading(false);
  }, [user, authLoading, isLoggedOut]);

  // Reset logout flag once we've rendered the auth screen
  useEffect(() => {
    if (showAuth && isLoggedOut) {
      setIsLoggedOut(false); // Ready for next login cycle
    }
  }, [showAuth, isLoggedOut, setIsLoggedOut]);

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
  };

  const handleLogout = () => {
    clearUserProfile();
    setUserProfile(null);
    setShowAuth(true); // Show Auth screen explicitly
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
                element={<Dashboard userProfile={userProfile} onLogout={handleLogout} />}
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
