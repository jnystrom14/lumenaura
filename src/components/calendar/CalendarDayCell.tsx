
import React from "react";
import { DailyProfile } from "../../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDayCellProps {
  profile: DailyProfile | null;
  isMobile: boolean;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ profile, isMobile }) => {
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

  if (!profile) {
    return (
      <div className={`${
        isMobile ? 'p-1 min-h-14' : 'p-2 min-h-24'
      } print:p-2 print:min-h-[5rem] border rounded-md bg-gray-50`}></div>
    );
  }

  return (
    <div className={`${
      isMobile ? 'p-1 min-h-14' : 'p-2 min-h-24'
    } print:p-2 print:min-h-[5rem] border rounded-md hover:bg-lumenaura-lavender hover:bg-opacity-10 transition-colors`}>
      <div className="flex justify-between items-start">
        <span className="font-medium print:text-lg">
          {profile.date.getDate()}
        </span>
        <span 
          className={`${isMobile ? 'text-[10px] px-1 py-0.5' : 'text-xs px-2 py-1'} print:text-xs print:px-2 print:py-1 rounded-full text-white print:border print:border-gray-400`}
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
      <div className={`${isMobile ? 'mt-1' : 'mt-2'} ${isMobile ? 'text-[10px]' : 'text-xs'} print:mt-2 print:text-xs`}>
        <div className="font-medium truncate flex items-center gap-0.5">
          {formatList(profile.numerologyData.colors)}
          {(profile.numerologyData.colors && profile.numerologyData.colors.length > 1) && (
            <Asterisk className={cn(
              isMobile ? "h-2 w-2" : "h-3 w-3",
              "print:h-2 print:w-2"
            )} />
          )}
        </div>
        {(!isMobile || true) && (
          <div className="font-medium break-words hyphens-auto truncate print:block">
            {formatList(profile.numerologyData.gems)}
          </div>
        )}
        <div className="text-muted-foreground truncate">
          {isMobile 
            ? profile.numerologyData.powerWord || ""
            : profile.numerologyData.powerWord || profile.numerologyData.keyPhrase}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayCell;
