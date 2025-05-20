
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./types";
import { getUserProfile, hasUserProfile, clearUserProfile, saveUserProfile } from "./utils/storage";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import Authentication from "./components/auth/Authentication";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    // Check for existing profiles from storage
    if (hasUserProfile()) {
      const profile = getUserProfile();
      setUserProfile(profile);
      setLoading(false);
      return;
    }
    
    // If authenticated but no profile exists, we still need to go through onboarding
    // to collect necessary information like birth date
    setLoading(false);
  }, [user, authLoading]);

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
  };

  const handleLogout = () => {
    clearUserProfile();
    setUserProfile(null);
    setShowAuth(true);
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
            <Authentication onContinueWithoutAccount={() => setShowAuth(false)} />
          ) : !userProfile ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard userProfile={userProfile} onLogout={handleLogout} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
