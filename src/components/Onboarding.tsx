
import React, { useState } from "react";
import { UserProfile } from "../types";
import { saveUserProfile } from "../utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

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
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
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
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      let result;
      
      if (isSignUp) {
        result = await signUpWithEmail(email, password);
      } else {
        result = await signInWithEmail(email, password);
      }
      
      if (result.error) {
        setError(result.error);
      } else if (isSignUp) {
        toast({
          title: "Account created",
          description: "Please check your email for verification instructions.",
        });
        setStep(1);
      } else {
        // For sign in, we'll proceed to profile creation/completion
        setStep(1);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
      }
      // The redirect will happen automatically, no need for additional code here
    } catch (err: any) {
      setError(err.message || "An error occurred during Google authentication");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 0) {
      handleAuth(e);
      return;
    }
    
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
  
  // Render authentication step
  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
        <div className="w-full max-w-md crystal-card p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">ColorPath</h1>
            <p className="text-gray-600">Your Daily Numerology Guide</p>
          </div>
          
          <div className="text-center space-y-2 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? "Sign up to start your journey" : "Sign in to continue your journey"}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="crystal-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="crystal-input"
                minLength={6}
                required
              />
            </div>
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continue with Google
            </Button>
            
            <p className="text-center text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"} 
              <button 
                type="button"
                className="text-primary hover:underline ml-1"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
            
            <p className="text-center text-sm">
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                Continue without an account
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }
  
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
