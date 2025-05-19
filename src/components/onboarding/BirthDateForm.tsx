
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface BirthDateFormProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  profilePicture: string;
  name: string;
  onBirthDayChange: (day: number) => void;
  onBirthMonthChange: (month: number) => void;
  onBirthYearChange: (year: number) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const BirthDateForm: React.FC<BirthDateFormProps> = ({
  birthDay,
  birthMonth,
  birthYear,
  profilePicture,
  name,
  onBirthDayChange,
  onBirthMonthChange,
  onBirthYearChange,
  onProfilePictureChange,
  error,
}) => {
  return (
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
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="12"
            placeholder="MM"
            value={birthMonth || ''}
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
            value={birthDay || ''}
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
            value={birthYear || ''}
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
          Profile Picture (Optional)
        </Label>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profilePicture} />
            <AvatarFallback className="bg-colorpath-lavender">
              {name.substring(0, 2).toUpperCase()}
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
    </div>
  );
};

export default BirthDateForm;
