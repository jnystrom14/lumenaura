
import React from "react";
import { UserProfile, DailyProfile } from "../types";
import { getDailyProfile } from "../utils/numerologyCalculator";
import { format, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, CircleDot } from "lucide-react";
import { exportDateRangePDF } from "../utils/pdfExport";

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
  
  // Generate profiles for each day in the range
  const profiles = eachDayOfInterval({ start: from, end: to })
    .map(date => getDailyProfile(userProfile, date));
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExportPDF = () => {
    exportDateRangePDF(profiles, from, to);
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

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-serif text-center">
          Date Range Calendar
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handlePrint} variant="default" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="print:block">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif">
            Numerology Forecast for {format(from, "MMMM d")} - {format(to, "MMMM d, yyyy")}
          </h2>
          <p className="text-muted-foreground">
            {profiles.length} days selected
          </p>
        </div>

        <div className="crystal-card p-4 print:border-none print:p-0 print:shadow-none">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getWeeks().map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((profile, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`p-2 min-h-24 border rounded-md ${
                      !profile
                        ? "bg-gray-50"
                        : "hover:bg-colorpath-lavender hover:bg-opacity-10 transition-colors"
                    }`}
                  >
                    {profile && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{profile.date.getDate()}</span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full text-white print:border print:border-gray-400"
                            style={{ 
                              backgroundColor: profile.numerologyData.colorHex,
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact"
                            }}
                          >
                            {profile.personalDay}
                          </span>
                        </div>
                        <div className="mt-2 text-xs">
                          <div className="font-medium text-xs">
                            {profile.numerologyData.color}
                          </div>
                          <div className="font-medium">{profile.numerologyData.gem}</div>
                          <div className="text-muted-foreground truncate">
                            {profile.numerologyData.powerWord}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="mt-6 crystal-card p-6 print:mt-2 print:border-none print:p-2 print:shadow-none">
          <h3 className="text-xl font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from(new Set(profiles.map(p => p.personalDay))).sort((a, b) => a - b).map(num => {
              const data = profiles.find(p => p.personalDay === num)?.numerologyData;
              if (!data) return null;
              return (
                <div key={num} className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-white font-medium print:border-gray-400" 
                    style={{ 
                      backgroundColor: data.colorHex,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact" 
                    }}
                  >
                    {num}
                  </div>
                  <div>
                    <div className="font-medium">Number {num}: {data.color}</div>
                    <div className="text-sm">Gem: {data.gem}</div>
                    <div className="text-sm text-muted-foreground">Power: {data.powerWord}</div>
                    <div className="text-sm hidden print:block">Lucky Number: {data.luckyNumber}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>
        {`
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
          }
        `}
      </style>
    </div>
  );
};

export default DateRangeCalendar;
