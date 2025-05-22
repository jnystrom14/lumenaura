
import React from "react";
import { format, isSameDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userProfile: UserProfile;
  selectedDate: Date;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userProfile,
  selectedDate,
  onLogout,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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
  
  const handleEditProfile = () => {
    navigate("/profile");
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

  if (isMobile) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-center mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center focus:outline-none">
                <Avatar className="h-16 w-16 border-2 border-lumenAura-lavender cursor-pointer">
                  <AvatarImage src={userProfile.profilePicture} />
                  <AvatarFallback className="bg-lumenAura-lavender">
                    {userProfile.name ? userProfile.name.substring(0, 2).toUpperCase() : 'NA'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">Menu</span>
                  <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 bg-white shadow-lg">
              <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
                <UserRound className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-serif font-medium">
            {getGreeting()}, {userProfile.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isToday(selectedDate)
              ? "Your numerology profile for today"
              : `Viewing profile for ${format(selectedDate, "MMM d, yyyy")}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 border-2 border-lumenAura-lavender cursor-pointer">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback className="bg-lumenAura-lavender">
                {userProfile.name ? userProfile.name.substring(0, 2).toUpperCase() : 'NA'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white shadow-lg">
            <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
              <UserRound className="h-4 w-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      </div>
    </div>
  );
};

export default DashboardHeader;
