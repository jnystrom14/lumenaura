
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Define our color groups with their hex values
const COLOR_GROUPS = {
  PURPLE: {
    colors: ["Purple", "Violet"],
    colorHexes: ["#9b87f5", "#7E69AB"]
  },
  BEIGE: {
    colors: ["Beige", "Brown", "Pink"],
    colorHexes: ["#f5f5dc", "#a52a2a", "#ffc0cb"]
  },
  BLACK: {
    colors: ["Black", "White", "Pearl Gray"],
    colorHexes: ["#000000", "#ffffff", "#e6e6e6"]
  },
  CORAL: {
    colors: ["Coral", "Russet"],
    colorHexes: ["#ff7f50", "#80461b"]
  }
};

// Component for displaying multiple intersecting color balls
const ColorBallGroup = ({ colorHexes, size = "w-4 h-4", mobileSize = "w-3 h-3" }: { 
  colorHexes: string[], 
  size?: string, 
  mobileSize?: string 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex -space-x-2 mr-2">
      {colorHexes.map((colorHex, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-full border border-gray-100",
            isMobile ? mobileSize : size,
            "print:w-2 print:h-2"
          )}
          style={{ 
            backgroundColor: colorHex,
            zIndex: colorHexes.length - index,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact"
          }}
        />
      ))}
    </div>
  );
};

const CalendarLegend: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "mt-4 p-2 rounded-md bg-white bg-opacity-50 border border-lumenaura-lavender border-opacity-30",
      "print:mt-2 print:p-1 print:border print:border-gray-200"
    )}>
      <h3 className={cn(
        "text-sm font-medium mb-1",
        isMobile ? "text-xs" : "",
        "print:text-xs print:mb-1"
      )}>
        Color Legend
      </h3>
      
      <div className={cn(
        "space-y-1",
        isMobile ? "text-xs" : "text-sm",
        "print:text-xs"
      )}>
        {Object.values(COLOR_GROUPS).map((group, index) => (
          <div key={index} className="flex items-center">
            <ColorBallGroup 
              colorHexes={group.colorHexes}
              size={isMobile ? "w-3 h-3" : "w-4 h-4"}
              mobileSize="w-2 h-2"
            />
            <span className="flex items-center gap-1">
              {group.colors.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
