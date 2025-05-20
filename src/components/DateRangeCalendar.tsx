
import React from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { exportDateRangePDF } from "../utils/pdfExport";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  // Group profiles by week for display
  const getWeeks = () => {
    const weeks: DailyProfile[][] = [];
    let currentWeek: DailyProfile[] = [];
    
    // Find the first day of the interval and determine its day of week
    const firstDay = profiles[0]?.date;
    if (!firstDay) return [];
    
    // Add empty placeholders for days before the first day
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null as unknown as DailyProfile);
    }
    
    // Add all days of the interval
    profiles.forEach(profile => {
      currentWeek.push(profile);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // If there are remaining days, add them as the last week
    if (currentWeek.length > 0) {
      // Fill the rest of the week with null
      while (currentWeek.length < 7) {
        currentWeek.push(null as unknown as DailyProfile);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  // Format colors and gems for display
  const formatList = (items: string[] | undefined): string => {
    if (!items || items.length === 0) return "";
    
    // On mobile, just show first item
    if (isMobile) {
      return items[0] || "";
    }
    
    // On desktop, show more
    if (items.length === 1) return items[0];
    return items.slice(0, 2).join(", ") + (items.length > 2 ? "..." : "");
  };

  // Function to determine if text color should be light or dark based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance using the formula for relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <div className={`container mx-auto px-2 ${isMobile ? 'py-4' : 'px-4 py-8'} animate-fade-in print:p-0`}>
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

      <div className="print:block">
        <div className="text-center mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif`}>
            {format(from, "MMM d")} - {format(to, "MMM d, yyyy")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {profiles.length} days selected
          </p>
        </div>

        <div className="crystal-card p-2 print:border-none print:p-0 print:shadow-none">
          <div className={`grid grid-cols-7 ${isMobile ? 'gap-0.5 mb-1' : 'gap-1 mb-2'}`}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={day + index} className={`text-center font-medium ${isMobile ? 'p-1 text-xs' : 'p-2'}`}>
                {day}
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-7 ${isMobile ? 'gap-0.5' : 'gap-1'}`}>
            {getWeeks().map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((profile, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`${
                      isMobile ? 'p-1 min-h-14' : 'p-2 min-h-24'
                    } border rounded-md ${
                      !profile
                        ? "bg-gray-50"
                        : "hover:bg-lumenaura-lavender hover:bg-opacity-10 transition-colors"
                    }`}
                  >
                    {profile && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {profile.date.getDate()}
                          </span>
                          <span 
                            className={`${isMobile ? 'text-[10px] px-1 py-0.5' : 'text-xs px-2 py-1'} rounded-full text-white print:border print:border-gray-400`}
                            style={{ 
                              backgroundColor: profile.numerologyData.colorHex || "#6B7280",
                              color: getContrastColor(profile.numerologyData.colorHex || "#6B7280"),
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact"
                            }}
                          >
                            {profile.personalDay}
                          </span>
                        </div>
                        {(!isMobile || dayIndex % 2 === 0) && (
                          <div className={`${isMobile ? 'mt-1' : 'mt-2'} ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                            <div className="font-medium truncate">
                              {formatList(profile.numerologyData.colors)}
                            </div>
                            {!isMobile && (
                              <div className="font-medium break-words hyphens-auto truncate">
                                {formatList(profile.numerologyData.gems)}
                              </div>
                            )}
                            {(!isMobile || weekIndex % 2 === 0) && (
                              <div className="text-muted-foreground truncate">
                                {isMobile 
                                  ? profile.numerologyData.powerWord || ""
                                  : profile.numerologyData.powerWord || profile.numerologyData.keyPhrase}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
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
          }
        `}
      </style>
    </div>
  );
};

export default DateRangeCalendar;
