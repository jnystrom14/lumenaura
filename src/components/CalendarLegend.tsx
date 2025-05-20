
import React from "react";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Define our color groups with their hex values
const COLOR_GROUPS = {
  PURPLE: {
    colors: ["Purple", "Violet"],
    colorHex: "#9b87f5"
  },
  BEIGE: {
    colors: ["Beige", "Brown", "Pink"],
    colorHex: "#f5f5dc"
  },
  BLACK: {
    colors: ["Black", "White", "Pearl Gray"],
    colorHex: "#000000"
  },
  CORAL: {
    colors: ["Coral", "Russet"],
    colorHex: "#ff7f50"
  }
};

// Component for displaying color balls
const ColorBall = ({ colorHex, size = "w-3 h-3", mobileSize = "w-2 h-2" }: { colorHex: string, size?: string, mobileSize?: string }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "rounded-full mr-1",
        isMobile ? mobileSize : size,
        "print:w-2 print:h-2"
      )}
      style={{ 
        backgroundColor: colorHex,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    />
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
      
      {/* Special color groups that need asterisks */}
      <div className={cn(
        "space-y-1",
        isMobile ? "text-xs" : "text-sm",
        "print:text-xs"
      )}>
        {Object.values(COLOR_GROUPS).map((group, index) => (
          <div key={index} className="flex items-center">
            <ColorBall 
              colorHex={group.colorHex} 
              size={isMobile ? "w-3 h-3" : "w-4 h-4"}
              mobileSize="w-2 h-2"
            />
            <span className="flex items-center gap-1">
              {group.colors[0]}
              <Asterisk 
                className={cn(
                  "inline-block", 
                  isMobile ? "h-2 w-2" : "h-3 w-3",
                  "print:h-2 print:w-2"
                )} 
              />
              <span className="text-muted-foreground">
                = {group.colors.join(", ")}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
