
import React from "react";
import { DailyProfile } from "../../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDayCellProps {
  profile: DailyProfile | null;
  isMobile: boolean;
}

// Define our special color groups that need asterisks
const SPECIAL_COLOR_GROUPS = [
  "purple", "violet",
  "beige", "brown", "pink",
  "black", "white", "pearl gray",
  "coral", "russet"
];

// Define our special gem groups that need asterisks
const SPECIAL_GEM_GROUPS = [
  "emerald", "jade",
  "turquoise", "aquamarine",
  "pearl", "sapphire", "lapis",
  "opal", "gold",
  "coral", "copper"
];

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ profile, isMobile }) => {
  // Format colors and gems for display
  const formatList = (items: string[] | undefined): string => {
    if (!items || items.length === 0) return "";
    return items[0] || "";
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

  // Helper function to check if the primary color needs an asterisk
  const shouldShowAsterisk = (primaryColor?: string): boolean => {
    if (!primaryColor) return false;
    
    const colorLower = primaryColor.toLowerCase();
    
    // Check if it's one of our special color groups
    return SPECIAL_COLOR_GROUPS.includes(colorLower);
  };

  // Helper function to check if the primary gem needs an asterisk
  const shouldShowGemAsterisk = (primaryGem?: string): boolean => {
    if (!primaryGem) return false;
    
    const gemLower = primaryGem.toLowerCase();
    
    // Check if it's one of our special gem groups
    return SPECIAL_GEM_GROUPS.includes(gemLower);
  };

  if (!profile) {
    return (
      <div className={`${
        isMobile ? 'p-2 min-h-[5rem]' : 'p-2 min-h-24'
      } print:p-2 print:min-h-[5rem] border rounded-md bg-gray-50`}></div>
    );
  }

  // Get primary color and gem
  const primaryColor = profile.numerologyData.colors?.[0];
  const primaryGem = profile.numerologyData.gems?.[0];

  return (
    <div className={`${
      isMobile ? 'p-2 min-h-[5rem]' : 'p-2 min-h-24'
    } print:p-2 print:min-h-[5rem] border rounded-md hover:bg-lumenaura-lavender hover:bg-opacity-10 transition-colors`}>
      <div className="flex justify-between items-start">
        <span className="font-medium print:text-lg">
          {profile.date.getDate()}
        </span>
        <span 
          className={`${isMobile ? 'text-xs px-2 py-1' : 'text-xs px-2 py-1'} print:text-xs print:px-2 print:py-1 rounded-full text-white print:border print:border-gray-400`}
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
      <div className={`${isMobile ? 'mt-2' : 'mt-2'} ${isMobile ? 'text-xs' : 'text-xs'} print:mt-2 print:text-xs`}>
        <div className="font-medium truncate flex items-center gap-0">
          {formatList(profile.numerologyData.colors)}
          {shouldShowAsterisk(primaryColor) && (
            <Asterisk className={cn(
              isMobile ? "h-3 w-3" : "h-3 w-3",
              "print:h-2 print:w-2"
            )} />
          )}
        </div>
        <div className="font-medium break-words hyphens-auto truncate flex items-center gap-0">
          {formatList(profile.numerologyData.gems)}
          {shouldShowGemAsterisk(primaryGem) && (
            <Asterisk className={cn(
              isMobile ? "h-3 w-3" : "h-3 w-3",
              "print:h-2 print:w-2"
            )} />
          )}
        </div>
        <div className="text-muted-foreground truncate">
          {profile.numerologyData.powerWord || profile.numerologyData.keyPhrase}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayCell;
