
import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getMonthlyProfiles } from "../utils/numerologyCalculator";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarLegend from "./CalendarLegend";
import CalendarGrid from "./calendar/CalendarGrid";
import { cn } from "@/lib/utils";
import PrintStyles from "../styles/printStyles";

interface MonthlyCalendarProps {
  userProfile: UserProfile;
  initialDate: Date;
  onBack: () => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  userProfile,
  initialDate,
  onBack,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [profiles, setProfiles] = useState<DailyProfile[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const monthlyData = getMonthlyProfiles(userProfile, year, month);
    setProfiles(monthlyData);
  }, [currentDate, userProfile]);

  const handlePrint = () => {
    window.print();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  return (
    <PrintStyles>
      <div className="container mx-auto px-2 print:px-0 print:w-full print:max-w-none animate-fade-in">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <Button onClick={onBack} variant="outline" className="gap-1 text-sm">
            <ArrowLeft className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? 'Back' : 'Back to Dashboard'}
          </Button>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-serif text-center`}>
            {isMobile ? 'Month' : 'Monthly Overview'}
          </h1>
          <Button onClick={handlePrint} variant="default" className="gap-1 text-sm">
            <Printer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? '' : 'Print'}
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4 print:mb-4">
          <Button onClick={handlePreviousMonth} variant="outline" className="print:hidden text-sm p-2">
            <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            {!isMobile && "Previous"}
          </Button>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-medium print:text-2xl`}>
            {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </h2>
          <Button onClick={handleNextMonth} variant="outline" className="print:hidden text-sm p-2">
            {!isMobile && "Next"}
            <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </div>

        <CalendarGrid profiles={profiles} />
        
        {/* Use the simplified calendar legend */}
        <CalendarLegend />
      </div>
    </PrintStyles>
  );
};

export default MonthlyCalendar;
