
import React from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarLegend from "./CalendarLegend";
import CalendarGrid from "./calendar/CalendarGrid";
import PrintStyles from "../styles/printStyles";

interface DateRangeCalendarProps {
  userProfile: UserProfile;
  dateRange: { from: Date; to: Date };
  onBack: () => void;
}

const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
  userProfile,
  dateRange,
  onBack,
}) => {
  const { from, to } = dateRange;
  const isMobile = useIsMobile();
  
  // Generate profiles for each day in the range
  const profiles = eachDayOfInterval({ start: from, end: to })
    .map(date => getDailyProfile(userProfile, date));
  
  const handlePrint = () => {
    window.print();
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
            {isMobile ? 'Date Range' : 'Date Range Calendar'}
          </h1>
          <Button onClick={handlePrint} variant="default" className="gap-1 text-sm">
            <Printer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? '' : 'Print'}
          </Button>
        </div>

        <div className="print:block print:w-full">
          <div className="text-center mb-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif print:text-2xl`}>
              {format(from, "MMM d")} - {format(to, "MMM d, yyyy")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {profiles.length} days selected
            </p>
          </div>

          <CalendarGrid profiles={profiles} />

          {/* Use the simplified calendar legend */}
          <CalendarLegend />
        </div>
      </div>
    </PrintStyles>
  );
};

export default DateRangeCalendar;
