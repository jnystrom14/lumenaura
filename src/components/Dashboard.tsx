
import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import NumerologyCard from "./NumerologyCard";
import MonthlyCalendar from "./MonthlyCalendar";

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyProfile, setDailyProfile] = useState<DailyProfile | null>(null);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  
  useEffect(() => {
    if (userProfile) {
      const profile = getDailyProfile(userProfile, selectedDate);
      setDailyProfile(profile);
    }
  }, [userProfile, selectedDate]);
  
  if (!dailyProfile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <div className="min-h-screen pb-12">
      {showMonthly ? (
        <MonthlyCalendar 
          userProfile={userProfile} 
          onBack={() => setShowMonthly(false)} 
          initialDate={selectedDate}
        />
      ) : (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <header className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-colorpath-lavender">
                <AvatarImage src={userProfile.profilePicture} />
                <AvatarFallback className="bg-colorpath-lavender">
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
            </div>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-colorpath-lavender"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                onClick={() => setShowMonthly(true)}
              >
                Monthly View
              </Button>
              
              <Button
                variant="ghost"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          </header>
          
          <NumerologyCard dailyProfile={dailyProfile} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="crystal-card p-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Your Numbers</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Universal Year:</span>
                  <span className="font-medium">{dailyProfile.universalYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Personal Year:</span>
                  <span className="font-medium">{dailyProfile.personalYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Personal Month:</span>
                  <span className="font-medium">{dailyProfile.personalMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Personal Day:</span>
                  <span className="font-semibold text-xl text-primary">{dailyProfile.personalDay}</span>
                </div>
              </div>
            </div>
            
            <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
              <div className="h-full flex flex-col">
                <blockquote className="text-lg italic text-gray-700 flex-grow">
                  "{dailyProfile.numerologyData.affirmation}"
                </blockquote>
                <div className="mt-auto">
                  <button className="text-primary hover:underline mt-4 text-sm">
                    Get Another Affirmation
                  </button>
                </div>
              </div>
            </div>
            
            <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-xl font-semibold mb-4">How to Use Today's Energy</h3>
              <p className="text-gray-700">
                {dailyProfile.numerologyData.meaning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
