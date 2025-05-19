import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getMonthlyProfiles } from "../utils/numerologyCalculator";
import { exportMonthlyPDF } from "../utils/pdfExport";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

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

  useEffect(() => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const monthlyData = getMonthlyProfiles(userProfile, year, month);
    setProfiles(monthlyData);
  }, [currentDate, userProfile]);

  const handleExport = () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    exportMonthlyPDF(profiles, month, year);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Group profiles by week
  const getWeeks = () => {
    const weeks: DailyProfile[][] = [];
    let currentWeek: DailyProfile[] = [];
    
    // Find the first day of the month and determine its day of week
    const firstDay = profiles[0]?.date;
    if (!firstDay) return [];
    
    // Add empty placeholders for days before the first of the month
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null as unknown as DailyProfile);
    }
    
    // Add all days of the month
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
          Monthly Overview
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            Export PDF
          </Button>
          <Button onClick={handlePrint} variant="default" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 print:mb-2">
        <Button onClick={handlePreviousMonth} variant="outline" className="print:hidden">
          Previous Month
        </Button>
        <h2 className="text-2xl font-medium">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={handleNextMonth} variant="outline" className="print:hidden">
          Next Month
        </Button>
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

export default MonthlyCalendar;
