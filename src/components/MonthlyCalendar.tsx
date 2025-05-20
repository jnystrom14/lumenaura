import React, { useState, useEffect } from "react";
import { UserProfile, DailyProfile } from "../types";
import { getMonthlyProfiles } from "../utils/numerologyCalculator";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarLegend from "./CalendarLegend";
import CalendarGrid from "./calendar/CalendarGrid";
import { cn } from "@/lib/utils";
import PrintStyles from "../styles/printStyles";

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const monthlyData = getMonthlyProfiles(userProfile, year, month);
    setProfiles(monthlyData);
  }, [currentDate, userProfile]);

  const handlePrint = () => {
    window.print();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Collect legend data from all profiles
  const getLegendItems = () => {
    const legendMap = new Map();
    
    // Helper to get primary color and hex from profile
    const processProfileColors = (profile: DailyProfile) => {
      const colors = profile.numerologyData.colors || [];
      if (colors.length > 0) {
        const primaryColor = colors[0];
        const primaryColorLower = primaryColor.toLowerCase();
        
        // Check for our special color groups
        if (primaryColorLower === "purple" || primaryColorLower === "violet") {
          legendMap.set("purple", {
            label: "Purple",
            colors: ["Purple", "Violet"],
            colorHex: "#9b87f5"
          });
        } else if (primaryColorLower === "beige" || primaryColorLower === "brown" || primaryColorLower === "pink") {
          legendMap.set("beige", {
            label: "Beige",
            colors: ["Beige", "Brown", "Pink"],
            colorHex: "#f5f5dc"
          });
        } else if (primaryColorLower === "black" || primaryColorLower === "white" || primaryColorLower.includes("pearl")) {
          legendMap.set("black", {
            label: "Black",
            colors: ["Black", "White", "Pearl Gray"],
            colorHex: "#000000"
          });
        } else if (primaryColorLower === "coral" || primaryColorLower === "russet") {
          legendMap.set("coral", {
            label: "Coral",
            colors: ["Coral", "Russet"],
            colorHex: "#ff7f50"
          });
        } else {
          // For other colors, store them normally
          if (!legendMap.has(primaryColorLower)) {
            legendMap.set(primaryColorLower, {
              label: primaryColor,
              colors: colors,
              colorHex: profile.numerologyData.colorHex
            });
          }
        }
      }
    };
    
    // Process all profiles
    profiles.forEach(processProfileColors);
    
    // Always include our special color groups
    if (!legendMap.has("purple")) {
      legendMap.set("purple", {
        label: "Purple",
        colors: ["Purple", "Violet"],
        colorHex: "#9b87f5"
      });
    }
    if (!legendMap.has("beige")) {
      legendMap.set("beige", {
        label: "Beige",
        colors: ["Beige", "Brown", "Pink"],
        colorHex: "#f5f5dc"
      });
    }
    if (!legendMap.has("black")) {
      legendMap.set("black", {
        label: "Black",
        colors: ["Black", "White", "Pearl Gray"],
        colorHex: "#000000"
      });
    }
    if (!legendMap.has("coral")) {
      legendMap.set("coral", {
        label: "Coral",
        colors: ["Coral", "Russet"],
        colorHex: "#ff7f50"
      });
    }
    
    return Array.from(legendMap.values());
  };

  return (
    <PrintStyles>
      <div className="container mx-auto px-2 print:px-0 print:w-full print:max-w-none animate-fade-in">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <Button onClick={onBack} variant="outline" className="gap-1 text-sm">
            <ArrowLeft className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? 'Back' : 'Back to Dashboard'}
          </Button>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-serif text-center`}>
            {isMobile ? 'Month' : 'Monthly Overview'}
          </h1>
          <Button onClick={handlePrint} variant="default" className="gap-1 text-sm">
            <Printer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? '' : 'Print'}
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4 print:mb-4">
          <Button onClick={handlePreviousMonth} variant="outline" className="print:hidden text-sm p-2">
            <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            {!isMobile && "Previous"}
          </Button>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-medium print:text-2xl`}>
            {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </h2>
          <Button onClick={handleNextMonth} variant="outline" className="print:hidden text-sm p-2">
            {!isMobile && "Next"}
            <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </div>

        <CalendarGrid profiles={profiles} />
        
        {/* Add the calendar legend with the improved data */}
        <CalendarLegend legendItems={getLegendItems()} />
      </div>
    </PrintStyles>
  );
};

export default MonthlyCalendar;
