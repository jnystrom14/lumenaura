
import React from "react";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LegendItem {
  label: string;
  colors: string[];
  colorHex?: string;
}

interface CalendarLegendProps {
  legendItems: LegendItem[];
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ legendItems }) => {
  const isMobile = useIsMobile();
  
  // Group legend items by their first color to avoid duplicates
  const groupedItems = legendItems.reduce((acc, item) => {
    const firstColor = item.colors[0];
    if (!acc[firstColor]) {
      acc[firstColor] = item;
    } else if (item.colors.length > acc[firstColor].colors.length) {
      // If this item has more colors, use it instead
      acc[firstColor] = item;
    }
    return acc;
  }, {} as Record<string, LegendItem>);

  const uniqueItems = Object.values(groupedItems);
  
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
        "grid grid-cols-2 gap-x-4 gap-y-1",
        isMobile ? "text-xs" : "text-sm",
        "print:text-xs print:grid-cols-3 print:gap-x-2"
      )}>
        {uniqueItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={cn(
                "w-3 h-3 rounded-full mr-1",
                isMobile ? "w-2 h-2" : "",
                "print:w-2 print:h-2"
              )}
              style={{ 
                backgroundColor: item.colorHex || "#6B7280",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact"
              }}
            />
            <span className="flex items-center gap-1">
              {item.colors[0]}
              {item.colors.length > 1 && (
                <Asterisk 
                  className={cn(
                    "inline-block", 
                    isMobile ? "h-2 w-2" : "h-3 w-3",
                    "print:h-2 print:w-2"
                  )} 
                />
              )}
            </span>
          </div>
        ))}
      </div>
      
      {/* Show expanded colors for items with asterisks */}
      <div className={cn(
        "mt-1 text-xs text-muted-foreground",
        isMobile ? "text-[10px]" : "",
        "print:text-[10px]"
      )}>
        {uniqueItems.filter(item => item.colors.length > 1).map((item, index) => (
          <div key={`expanded-${index}`} className="flex items-start gap-1">
            <Asterisk className={cn(
              "inline-block shrink-0",
              isMobile ? "h-2 w-2 mt-0.5" : "h-3 w-3 mt-0.5",
              "print:h-2 print:w-2"
            )} />
            <span>{item.colors.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
