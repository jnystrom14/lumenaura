
import React from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarLegend from "./CalendarLegend";
import CalendarGrid from "./calendar/CalendarGrid";

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
  
  // Collect legend data from all profiles
  const getLegendItems = () => {
    const legendMap = new Map();
    
    profiles.forEach(profile => {
      const colors = profile.numerologyData.colors || [];
      if (colors.length > 0) {
        const firstColor = colors[0];
        if (!legendMap.has(firstColor)) {
          legendMap.set(firstColor, {
            label: firstColor,
            colors: colors,
            colorHex: profile.numerologyData.colorHex
          });
        } else if (colors.length > legendMap.get(firstColor).colors.length) {
          // Update if this entry has more colors
          legendMap.set(firstColor, {
            label: firstColor,
            colors: colors,
            colorHex: profile.numerologyData.colorHex
          });
        }
      }
    });
    
    return Array.from(legendMap.values());
  };

  return (
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

        {/* Add the calendar legend */}
        <CalendarLegend legendItems={getLegendItems()} />
      </div>

      <style>
        {`
          @media (max-width: 640px) {
            .grid-cols-7 > div {
              touch-action: manipulation;
            }
          }
          
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .crystal-card {
              background: white !important;
              box-shadow: none !important;
            }
            @page {
              size: portrait;
              margin: 1cm;
            }
            /* Force color printing */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            /* Hide toast notifications */
            [role="status"],
            [aria-live="polite"],
            [data-radix-toast-viewport],
            [data-sonner-toast-group] {
              display: none !important;
            }
            /* Prevent content overflow */
            .grid > div {
              overflow: hidden !important;
              page-break-inside: avoid !important;
            }
            .truncate {
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              max-width: 100% !important;
            }
            /* Make sure the calendar takes full width when printing */
            .container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
            }
            .grid-cols-7 {
              width: 100% !important;
              grid-template-columns: repeat(7, 1fr) !important;
            }
            .crystal-card {
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DateRangeCalendar;
