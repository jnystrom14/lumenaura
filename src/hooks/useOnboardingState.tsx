
import { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getUserProfile, hasUserProfile, saveUserProfile } from "../utils/storage";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

export function useOnboardingState(onComplete: () => void) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1); // Start with personal info
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    birthDay: 1,
    birthMonth: 1,
    birthYear: 1990,
    profilePicture: ""
  });
  const [error, setError] = useState<string>("");
  
  // Check for existing user profile or fill from authenticated user info
  useEffect(() => {
    if (hasUserProfile()) {
      // If there's a profile in storage, use it to complete the onboarding
      const existingProfile = getUserProfile();
      if (existingProfile) {
        // Make sure we include profilePicture in the check for completeness
        if (existingProfile.name && 
            existingProfile.birthDay && 
            existingProfile.birthMonth && 
            existingProfile.birthYear) {
          saveUserProfile(existingProfile);
          onComplete();
          return;
        } else {
          // If profile exists but isn't complete, pre-fill what we have
          setProfile(existingProfile);
        }
      }
    }
    
    // Pre-fill profile picture if available from authenticated user
    if (user) {
      setProfile(prevProfile => ({
        ...prevProfile,
        profilePicture: user.user_metadata?.avatar_url || prevProfile.profilePicture,
        // Try to get name from user metadata if available
        name: user.user_metadata?.full_name || user.user_metadata?.name || prevProfile.name
      }));
    }
  }, [user, onComplete]);

  // Form field handlers
  const handleNameChange = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
  };

  const handleBirthDayChange = (day: number) => {
    setProfile(prev => ({ ...prev, birthDay: day }));
  };

  const handleBirthMonthChange = (month: number) => {
    setProfile(prev => ({ ...prev, birthMonth: month }));
  };

  const handleBirthYearChange = (year: number) => {
    setProfile(prev => ({ ...prev, birthYear: year }));
  };

  const handleProfilePictureChange = (pictureDataUrl: string) => {
    setProfile(prev => ({
      ...prev,
      profilePicture: pictureDataUrl
    }));
  };
  
  return {
    user,
    step,
    setStep,
    profile,
    error,
    setError,
    handleNameChange,
    handleBirthDayChange,
    handleBirthMonthChange,
    handleBirthYearChange,
    handleProfilePictureChange,
    toast,
  };
}
