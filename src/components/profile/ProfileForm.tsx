
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types";

interface ProfileFormProps {
  profile: UserProfile;
  error?: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onNameChange: (name: string) => void;
  onBirthDayChange: (day: number) => void;
  onBirthMonthChange: (month: number) => void;
  onBirthYearChange: (year: number) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  error,
  isLoading,
  onSubmit,
  onNameChange,
  onBirthDayChange,
  onBirthMonthChange,
  onBirthYearChange,
  onProfilePictureChange
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name"
          type="text"
          placeholder="Enter your name"
          value={profile.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="crystal-input"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthMonth">Month</Label>
          <Input 
            id="birthMonth"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="12"
            placeholder="MM"
            value={profile.birthMonth || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
              onBirthMonthChange(value || 1);
            }}
            className="crystal-input touch-manipulation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDay">Day</Label>
          <Input 
            id="birthDay"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="31"
            placeholder="DD"
            value={profile.birthDay || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
              onBirthDayChange(value || 1);
            }}
            className="crystal-input touch-manipulation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthYear">Year</Label>
          <Input 
            id="birthYear"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="YYYY"
            value={profile.birthYear || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
              onBirthYearChange(value || 1990);
            }}
            className="crystal-input touch-manipulation"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profilePicture" className="block mb-2">
          Profile Picture
        </Label>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profilePicture} />
            <AvatarFallback className="bg-colorpath-lavender">
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'NA'}
            </AvatarFallback>
          </Avatar>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={onProfilePictureChange}
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

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
