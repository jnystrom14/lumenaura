
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./types";
import { getUserProfile, hasUserProfile, clearUserProfile } from "./utils/storage";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user profile exists in local storage
    if (hasUserProfile()) {
      const profile = getUserProfile();
      setUserProfile(profile);
    }
    
    setLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
  };

  const handleLogout = () => {
    clearUserProfile();
    setUserProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading ColorPath...</p>
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
          {!userProfile ? (
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
