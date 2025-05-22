
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfile } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { updateUserProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import ProfileForm from "@/components/profile/ProfileForm";

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  userProfile,
  onProfileUpdate
}) => {
  const [profile, setProfile] = useState<UserProfile>({...userProfile});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNameChange = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
  };

  const handleBirthDayChange = (birthDay: number) => {
    setProfile(prev => ({ ...prev, birthDay }));
  };

  const handleBirthMonthChange = (birthMonth: number) => {
    setProfile(prev => ({ ...prev, birthMonth }));
  };

  const handleBirthYearChange = (birthYear: number) => {
    setProfile(prev => ({ ...prev, birthYear }));
  };

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validate profile data
      if (!profile.name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      
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
        setLoading(false);
        return;
      }
      
      // Save profile to Supabase and local storage
      const result = await updateUserProfile(profile, user);
      
      if (!result.success) {
        setError(result.error || "Failed to save profile");
        setLoading(false);
        return;
      }
      
      // Update profile in parent component
      onProfileUpdate(profile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully"
      });
      
      // Navigate back to dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md crystal-card p-8 space-y-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Edit Profile</h1>
        </div>
        
        <ProfileForm 
          profile={profile}
          error={error}
          isLoading={loading}
          onSubmit={handleSubmit}
          onNameChange={handleNameChange}
          onBirthDayChange={handleBirthDayChange}
          onBirthMonthChange={handleBirthMonthChange}
          onBirthYearChange={handleBirthYearChange}
          onProfilePictureChange={handleProfilePictureChange}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
