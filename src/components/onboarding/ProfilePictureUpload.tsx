
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfilePictureUploadProps {
  profilePicture: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  name,
  onChange
}) => {
  return (
    <div className="space-y-2">
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
          onChange={onChange}
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
  );
};

export default ProfilePictureUpload;
