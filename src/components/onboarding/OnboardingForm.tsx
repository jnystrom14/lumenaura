
import React from "react";
import { Button } from "@/components/ui/button";
import PersonalInfoForm from "./PersonalInfoForm";
import BirthDateForm from "./BirthDateForm";
import { UserProfile } from "@/types";

interface OnboardingFormProps {
  step: number;
  profile: UserProfile;
  error?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onNameChange: (name: string) => void;
  onBirthDayChange: (day: number) => void;
  onBirthMonthChange: (month: number) => void;
  onBirthYearChange: (year: number) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({
  step,
  profile,
  error,
  onSubmit,
  onNameChange,
  onBirthDayChange,
  onBirthMonthChange,
  onBirthYearChange,
  onProfilePictureChange,
  onBack
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {step === 1 ? (
        <PersonalInfoForm 
          name={profile.name} 
          setName={onNameChange} 
          error={error} 
        />
      ) : (
        <BirthDateForm 
          birthDay={profile.birthDay}
          birthMonth={profile.birthMonth}
          birthYear={profile.birthYear}
          profilePicture={profile.profilePicture}
          name={profile.name}
          onBirthDayChange={onBirthDayChange}
          onBirthMonthChange={onBirthMonthChange}
          onBirthYearChange={onBirthYearChange}
          onProfilePictureChange={onProfilePictureChange}
          error={error}
        />
      )}
      
      <div className="flex justify-between">
        {step === 2 && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
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
  );
};

export default OnboardingForm;
