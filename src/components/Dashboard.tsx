
import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { DateRange } from "react-day-picker";
import NumerologyCard from "./NumerologyCard";
import MonthlyCalendar from "./MonthlyCalendar";
import DateRangeCalendar from "./DateRangeCalendar";
import DashboardHeader from "./dashboard/DashboardHeader";
import DateControls from "./dashboard/DateControls";
import InsightCards from "./dashboard/InsightCards";
import { useIsMobile } from "../hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (userProfile) {
      const profile = getDailyProfile(userProfile, selectedDate);
      setDailyProfile(profile);
    }
  }, [userProfile, selectedDate]);
  
  if (!dailyProfile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
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
  
  // Fix: Ensure both from and to dates exist before passing to DateRangeCalendar
  if (showDateRange && dateRange?.from && dateRange?.to) {
    return (
      <DateRangeCalendar
        userProfile={userProfile}
        dateRange={{ from: dateRange.from, to: dateRange.to }}
        onBack={() => setShowDateRange(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-5 md:space-y-8 animate-fade-in">
        <header className={isMobile ? "mb-4" : "flex flex-col space-y-4 mb-6"}>
          <DashboardHeader 
            userProfile={userProfile} 
            selectedDate={selectedDate} 
            onLogout={onLogout} 
          />
          
          {isMobile && <div className="h-2" />}
          
          <div className={isMobile ? "bg-white/30 rounded-xl p-3 shadow-sm" : ""}>
            <DateControls
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dateRange={dateRange}
              setDateRange={setDateRange}
              isRangeMode={isRangeMode}
              setIsRangeMode={setIsRangeMode}
              setShowMonthly={setShowMonthly}
              setShowDateRange={setShowDateRange}
              onLogout={onLogout}
            />
          </div>
        </header>
        
        <NumerologyCard dailyProfile={dailyProfile} />
        
        <InsightCards dailyProfile={dailyProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
