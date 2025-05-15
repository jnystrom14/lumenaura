
import React, { useState } from "react";
import { UserProfile } from "../types";
import { saveUserProfile } from "../utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    birthDay: 1,
    birthMonth: 1,
    birthYear: 1990,
    profilePicture: ""
  });
  const [error, setError] = useState<string>("");
  
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
    } else {
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
      
      saveUserProfile(profile);
      onComplete();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md crystal-card p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">ColorPath</h1>
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
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
                <p className="text-gray-600">Let's get to know you</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="crystal-input"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">Your Birth Details</h2>
                <p className="text-gray-600">Required for numerology calculations</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthMonth">Month</Label>
                  <Input 
                    id="birthMonth"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="MM"
                    value={profile.birthMonth}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      birthMonth: parseInt(e.target.value) || 1 
                    }))}
                    className="crystal-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDay">Day</Label>
                  <Input 
                    id="birthDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="DD"
                    value={profile.birthDay}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      birthDay: parseInt(e.target.value) || 1 
                    }))}
                    className="crystal-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthYear">Year</Label>
                  <Input 
                    id="birthYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="YYYY"
                    value={profile.birthYear}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      birthYear: parseInt(e.target.value) || 1990 
                    }))}
                    className="crystal-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="block mb-2">
                  Profile Picture (Optional)
                </Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.profilePicture} />
                    <AvatarFallback className="bg-colorpath-lavender">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('profilePicture')?.click()}
                  >
                    Choose Image
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
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
