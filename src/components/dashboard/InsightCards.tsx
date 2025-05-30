
import React, { useState } from "react";
import { DailyProfile } from "../../types";
import { useIsMobile } from "../../hooks/use-mobile";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import PersonalYearInfo from "./PersonalYearInfo";

interface InsightCardsProps {
  dailyProfile: DailyProfile;
}

const InsightCards: React.FC<InsightCardsProps> = ({ dailyProfile }) => {
  const isMobile = useIsMobile();
  const [showPersonalYear, setShowPersonalYear] = useState(false);
  
  // Format array values for display
  const formatArrayValues = (values: string[] | undefined): string => {
    if (!values || values.length === 0) return "";
    return values.join(", ");
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mt-8">
        <div className="crystal-card p-6 animate-fade-in">
          <h3 className={`${isMobile ? 'text-xl mb-4' : 'text-xl mb-4'} font-semibold`}>Your Numbers</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`${isMobile ? 'text-base' : ''} text-muted-foreground`}>Universal Year:</span>
              <span className={`${isMobile ? 'text-base' : ''} font-medium`}>{dailyProfile.universalYear}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${isMobile ? 'text-base' : ''} text-muted-foreground`}>Personal Year:</span>
              <div className="flex flex-col items-end">
                <span className={`${isMobile ? 'text-base' : ''} font-medium`}>{dailyProfile.personalYear.value}</span>
                {dailyProfile.personalYear.masterNumber && (
                  <span className="text-xs text-purple-600 font-medium">✨ Master {dailyProfile.personalYear.masterNumber}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${isMobile ? 'text-base' : ''} text-muted-foreground`}>Personal Month:</span>
              <div className="flex flex-col items-end">
                <span className={`${isMobile ? 'text-base' : ''} font-medium`}>{dailyProfile.personalMonth.value}</span>
                {dailyProfile.personalMonth.masterNumber && (
                  <span className="text-xs text-purple-600 font-medium">✨ Master {dailyProfile.personalMonth.masterNumber}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${isMobile ? 'text-base' : ''} text-muted-foreground`}>Personal Day:</span>
              <div className="flex flex-col items-end">
                <span className={`${isMobile ? 'text-2xl' : 'text-xl'} font-semibold text-primary`}>
                  {dailyProfile.personalDay.value}
                </span>
                {dailyProfile.personalDay.masterNumber && (
                  <span className="text-sm text-purple-600 font-semibold">
                    ✨ Master {dailyProfile.personalDay.masterNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h3 className={`${isMobile ? 'text-xl mb-4' : 'text-xl mb-4'} font-semibold`}>Daily Affirmation</h3>
          <div className="h-full flex flex-col">
            <blockquote className={`${isMobile ? 'text-lg' : 'text-lg'} italic text-gray-700 flex-grow`}>
              "{dailyProfile.numerologyData.affirmation || dailyProfile.numerologyData.meditation}"
            </blockquote>
          </div>
        </div>
        
        <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className={`${isMobile ? 'text-xl mb-4' : 'text-xl mb-4'} font-semibold`}>How to Use Today's Energy</h3>
          <p className={`${isMobile ? 'text-base leading-relaxed' : 'text-base'} text-gray-700`}>
            {dailyProfile.numerologyData.meaning || dailyProfile.numerologyData.description}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          variant={showPersonalYear ? "default" : "outline"}
          onClick={() => setShowPersonalYear(!showPersonalYear)}
          className={`flex items-center gap-2 transition-all ${isMobile ? 'text-base py-2 px-4' : ''}`}
        >
          <Calendar className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          {showPersonalYear ? 'Hide Personal Year Insights' : 'Show Personal Year Insights'}
        </Button>
      </div>
      
      {showPersonalYear && dailyProfile.numerologyData.personalYear && (
        <PersonalYearInfo dailyProfile={dailyProfile} />
      )}
    </>
  );
};

export default InsightCards;
