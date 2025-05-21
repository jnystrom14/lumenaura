
import React from "react";
import { format, isSameDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  userProfile: UserProfile;
  selectedDate: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userProfile,
  selectedDate,
}) => {
  const isMobile = useIsMobile();
  
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

  // If userProfile is null or undefined, show a loading skeleton
  if (!userProfile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col items-center text-center' : 'items-center'} space-x-4`}>
        <Avatar className={`${isMobile ? 'h-16 w-16 mb-2' : 'h-12 w-12'} border-2 border-lumenAura-lavender`}>
          <AvatarImage src={userProfile.profilePicture} />
          <AvatarFallback className="bg-lumenAura-lavender">
            {userProfile.name ? userProfile.name.substring(0, 2).toUpperCase() : 'NA'}
          </AvatarFallback>
        </Avatar>
        <div className={isMobile ? "text-center w-full" : ""}>
          <h1 className={`${isMobile ? 'text-2xl mt-1' : 'text-2xl'} font-serif`}>
            {getGreeting()}, <span className="font-semibold">{userProfile.name}</span>
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-sm'} text-muted-foreground`}>
            {isToday(selectedDate)
              ? "Here's your numerology profile for today"
              : `Viewing profile for ${format(selectedDate, "MMMM d, yyyy")}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
