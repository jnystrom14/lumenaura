
import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { saveUserProfile, getUserProfile, hasUserProfile } from "../utils/storage";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Authentication from "./auth/Authentication";
import PersonalInfoForm from "./onboarding/PersonalInfoForm";
import BirthDateForm from "./onboarding/BirthDateForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
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
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfile(prev => ({
          ...prev,
          profilePicture: event.target.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!profile.name.trim()) {
        setError("Please enter your name");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      // Validate birth date
      if (
        !profile.birthDay || 
        !profile.birthMonth || 
        !profile.birthYear ||
        profile.birthDay < 1 || 
        profile.birthDay > 31 ||
        profile.birthMonth < 1 || 
        profile.birthMonth > 12
      ) {
        setError("Please enter a valid birth date");
        return;
      }
      
      // Ensure we save the updated profile with any uploaded profile picture
      saveUserProfile({
        ...profile,
        profilePicture: profile.profilePicture || ""
      });
      
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully"
      });
      onComplete();
    }
  };

  // Handle setting name
  const handleNameChange = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
  };

  // Handle birth date changes
  const handleBirthDayChange = (day: number) => {
    setProfile(prev => ({ ...prev, birthDay: day }));
  };

  const handleBirthMonthChange = (month: number) => {
    setProfile(prev => ({ ...prev, birthMonth: month }));
  };

  const handleBirthYearChange = (year: number) => {
    setProfile(prev => ({ ...prev, birthYear: year }));
  };

  // Handle continue without account
  const handleContinueWithoutAccount = () => {
    setStep(1);
    setError("");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md crystal-card p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">LumenAura</h1>
          <p className="text-gray-600">Your Daily Numerology Guide</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-colorpath-lavender border-opacity-50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white bg-opacity-70 text-gray-500">
              Step {step} of 2
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <PersonalInfoForm 
              name={profile.name} 
              setName={handleNameChange} 
              error={error} 
            />
          ) : (
            <BirthDateForm 
              birthDay={profile.birthDay}
              birthMonth={profile.birthMonth}
              birthYear={profile.birthYear}
              profilePicture={profile.profilePicture}
              name={profile.name}
              onBirthDayChange={handleBirthDayChange}
              onBirthMonthChange={handleBirthMonthChange}
              onBirthYearChange={handleBirthYearChange}
              onProfilePictureChange={handleProfilePictureChange}
              error={error}
            />
          )}
          
          <div className="flex justify-between">
            {step === 2 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            <Button 
              type="submit" 
              className={`${step === 1 ? 'w-full' : 'ml-auto'} bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity`}
            >
              {step === 1 ? 'Next' : 'Start Your Journey'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
