
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFormProps {
  name: string;
  setName: (name: string) => void;
  error?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ name, setName, error }) => {
  return (
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="crystal-input"
          autoFocus
        />
      </div>
      
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
};

export default PersonalInfoForm;
