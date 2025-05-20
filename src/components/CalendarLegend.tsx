
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

// Define our color groups
const COLOR_GROUPS = {
  PURPLE: ["Purple", "Violet"],
  BEIGE: ["Beige", "Brown", "Pink"],
  BLACK: ["Black", "White", "Pearl Gray"],
  CORAL: ["Coral", "Russet"]
};

// Function to standardize color names for comparison
const normalizeColor = (color: string): string => {
  return color.trim().toLowerCase();
};

const CalendarLegend: React.FC<CalendarLegendProps> = ({ legendItems }) => {
  const isMobile = useIsMobile();
  
  // Process the legend items to ensure our color groups are represented
  const processLegendItems = () => {
    const uniqueItems: LegendItem[] = [];
    const processed = new Set<string>();
    
    // Helper function to add standard color groups
    const addColorGroup = (primaryColor: string, allColors: string[], colorHex?: string) => {
      if (!processed.has(normalizeColor(primaryColor))) {
        uniqueItems.push({
          label: primaryColor,
          colors: allColors,
          colorHex
        });
        processed.add(normalizeColor(primaryColor));
      }
    };
    
    // First, add any colors from the provided legend items
    legendItems.forEach(item => {
      if (item.colors && item.colors.length > 0) {
        const primaryColor = item.colors[0];
        const primaryNormalized = normalizeColor(primaryColor);
        
        // Check if this is one of our special color groups
        if (primaryNormalized === "purple") {
          addColorGroup(primaryColor, COLOR_GROUPS.PURPLE, item.colorHex);
        } else if (primaryNormalized === "beige") {
          addColorGroup(primaryColor, COLOR_GROUPS.BEIGE, item.colorHex);
        } else if (primaryNormalized === "black") {
          addColorGroup(primaryColor, COLOR_GROUPS.BLACK, item.colorHex);
        } else if (primaryNormalized === "coral") {
          addColorGroup(primaryColor, COLOR_GROUPS.CORAL, item.colorHex);
        } else if (!processed.has(primaryNormalized)) {
          // For other colors, just add them as-is
          uniqueItems.push(item);
          processed.add(primaryNormalized);
        }
      }
    });
    
    // Ensure all our special color groups are always included
    if (!processed.has("purple")) {
      addColorGroup("Purple", COLOR_GROUPS.PURPLE, "#9b87f5"); // Using the primary purple hex
    }
    if (!processed.has("beige")) {
      addColorGroup("Beige", COLOR_GROUPS.BEIGE, "#f5f5dc"); // Standard beige hex
    }
    if (!processed.has("black")) {
      addColorGroup("Black", COLOR_GROUPS.BLACK, "#000000"); // Standard black hex
    }
    if (!processed.has("coral")) {
      addColorGroup("Coral", COLOR_GROUPS.CORAL, "#ff7f50"); // Standard coral hex
    }
    
    return uniqueItems;
  };
  
  const finalLegendItems = processLegendItems();
  
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
        {finalLegendItems.map((item, index) => (
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
        {finalLegendItems.filter(item => item.colors.length > 1).map((item, index) => (
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
