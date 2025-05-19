
import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "../../types";
import { Button } from "@/components/ui/button";
import { InfoIcon, XIcon } from "lucide-react";
import NumerologyTable from "../NumerologyTable";

interface DashboardHeaderProps {
  userProfile: UserProfile;
  selectedDate: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userProfile,
  selectedDate,
}) => {
  const [showReferenceTable, setShowReferenceTable] = useState(false);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-lumenAura-lavender">
          <AvatarImage src={userProfile.profilePicture} />
          <AvatarFallback className="bg-lumenAura-lavender">
            {userProfile.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-serif">
            {getGreeting()}, <span className="font-semibold">{userProfile.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {isToday(selectedDate)
              ? "Here's your numerology profile for today"
              : `Viewing profile for ${format(selectedDate, "MMMM d, yyyy")}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex items-center gap-1"
          onClick={() => setShowReferenceTable(!showReferenceTable)}
        >
          {showReferenceTable ? (
            <>
              <XIcon className="h-4 w-4" /> Hide Reference
            </>
          ) : (
            <>
              <InfoIcon className="h-4 w-4" /> Numbers & Colors
            </>
          )}
        </Button>
      </div>
      
      {showReferenceTable && <NumerologyTable />}
    </div>
  );
};

export default DashboardHeader;
