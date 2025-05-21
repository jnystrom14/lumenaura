
import React from "react";
import { useOnboardingState } from "../hooks/useOnboardingState";
import { saveProfileToSupabase } from "../services/profileService";
import OnboardingForm from "./onboarding/OnboardingForm";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { 
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
    toast
  } = useOnboardingState(onComplete);
  
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleProfilePictureChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
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
      
      // Save profile to Supabase and local storage
      const result = await saveProfileToSupabase(profile, user);
      
      if (!result.success) {
        setError(result.error || "Failed to save profile");
        return;
      }
      
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully"
      });
      onComplete();
    }
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
        
        <OnboardingForm
          step={step}
          profile={profile}
          error={error}
          onSubmit={handleSubmit}
          onNameChange={handleNameChange}
          onBirthDayChange={handleBirthDayChange}
          onBirthMonthChange={handleBirthMonthChange}
          onBirthYearChange={handleBirthYearChange}
          onProfilePictureChange={handleProfilePictureUpload}
          onBack={() => setStep(1)}
        />
      </div>
    </div>
  );
};

export default Onboarding;
