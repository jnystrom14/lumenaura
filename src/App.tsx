
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

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    // Check if user is authenticated but no profile exists
    if (user && !hasUserProfile()) {
      // Create a default profile for the authenticated user
      const defaultProfile: UserProfile = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
        birthDay: 1,
        birthMonth: 1,
        birthYear: 1990,
        profilePicture: user.user_metadata?.avatar_url || ""
      };

      // Save the profile and update state
      saveUserProfile(defaultProfile);
      setUserProfile(defaultProfile);
      toast({
        title: "Profile created",
        description: "Welcome to ColorPath! Please complete your profile to get personalized insights.",
      });
    } else if (hasUserProfile()) {
      // Normal case: profile exists
      const profile = getUserProfile();
      setUserProfile(profile);
    }
    
    // Set loading to false once we've handled authentication and profile
    setLoading(false);
  }, [user, authLoading, toast]);

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
  };

  const handleLogout = () => {
    clearUserProfile();
    setUserProfile(null);
  };

  if (loading || authLoading) {
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
