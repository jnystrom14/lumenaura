import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Calendar as CalendarRangeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import NumerologyCard from "./NumerologyCard";
import MonthlyCalendar from "./MonthlyCalendar";
import DateRangeCalendar from "./DateRangeCalendar";
import { DateRange } from "react-day-picker";
import { toast } from "@/components/ui/use-toast";

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dailyProfile, setDailyProfile] = useState<DailyProfile | null>(null);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  
  useEffect(() => {
    if (userProfile) {
      const profile = getDailyProfile(userProfile, selectedDate);
      setDailyProfile(profile);
    }
  }, [userProfile, selectedDate]);
  
  const handleDateRangeSelection = () => {
    if (dateRange?.from && dateRange?.to) {
      const days = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      toast({
        title: "Date range selected",
        description: `You selected ${days} days from ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}`,
      });
      setIsRangeMode(false);
      setSelectedDate(dateRange.from);
      setShowDateRange(true);
    }
  };
  
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
    return isSameDay(date, today);
  };
  
  // Show different views based on state
  if (showMonthly) {
    return (
      <MonthlyCalendar 
        userProfile={userProfile} 
        onBack={() => setShowMonthly(false)} 
        initialDate={selectedDate}
      />
    );
  }
  
  if (showDateRange && dateRange?.from && dateRange?.to) {
    return (
      <DateRangeCalendar
        userProfile={userProfile}
        dateRange={dateRange}
        onBack={() => setShowDateRange(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen pb-12">
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
          <div className="flex flex-wrap gap-2">
            {isRangeMode ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-colorpath-lavender"
                  >
                    <CalendarRangeIcon className="h-4 w-4" />
                    <span>
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Select date range"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <div className="p-3">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={selectedDate}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => setIsRangeMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleDateRangeSelection}
                        disabled={!dateRange?.from || !dateRange?.to}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
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
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <Button 
              variant="outline"
              onClick={() => setIsRangeMode(!isRangeMode)}
              className="border-colorpath-lavender"
            >
              {isRangeMode ? "Single Date" : "Date Range"}
            </Button>
            
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
    </div>
  );
};

export default Dashboard;
