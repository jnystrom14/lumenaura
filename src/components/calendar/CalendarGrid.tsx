
import React from "react";
import { DailyProfile } from "../../types";
import CalendarDayCell from "./CalendarDayCell";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarGridProps {
  profiles: DailyProfile[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ profiles }) => {
  const isMobile = useIsMobile();

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
    <div className="crystal-card p-2 print:border-none print:p-0 print:shadow-none print:w-full">
      <div className={`grid grid-cols-7 ${isMobile ? 'gap-1 mb-2' : 'gap-1 mb-2'} print:gap-2 print:mb-2`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={day + index} className={`text-center font-medium ${isMobile ? 'p-2 text-sm' : 'p-2'} print:p-2 print:text-base`}>
            {day}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 ${isMobile ? 'gap-1' : 'gap-1'} print:gap-2 print:w-full`}>
        {getWeeks().map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((profile, dayIndex) => (
              <CalendarDayCell 
                key={`${weekIndex}-${dayIndex}`} 
                profile={profile}
                isMobile={isMobile} 
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
