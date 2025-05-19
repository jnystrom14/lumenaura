
import React from "react";
import { DailyProfile } from "../../types";
import { useIsMobile } from "../../hooks/use-mobile";

interface InsightCardsProps {
  dailyProfile: DailyProfile;
}

const InsightCards: React.FC<InsightCardsProps> = ({ dailyProfile }) => {
  const isMobile = useIsMobile();
  
  // Format array values for display
  const formatArrayValues = (values: string[] | undefined): string => {
    if (!values || values.length === 0) return "";
    return values.join(", ");
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4 mt-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'}`}>
      <div className="crystal-card p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-4">Your Numbers</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Universal Year:</span>
            <span className="font-medium">{dailyProfile.universalYear}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Personal Year:</span>
            <span className="font-medium">{dailyProfile.personalYear}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Personal Month:</span>
            <span className="font-medium">{dailyProfile.personalMonth}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Personal Day:</span>
            <span className="font-semibold text-xl text-primary">{dailyProfile.personalDay}</span>
          </div>
          {dailyProfile.numerologyData.todaysTheme && (
            <div className="flex justify-between items-center pt-2 border-t mt-2">
              <span className="text-muted-foreground">Today's Theme:</span>
              <span className="font-medium text-primary">{dailyProfile.numerologyData.todaysTheme}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
        <div className="h-full flex flex-col">
          <blockquote className="text-lg italic text-gray-700 flex-grow">
            "{dailyProfile.numerologyData.affirmation || dailyProfile.numerologyData.meditation}"
          </blockquote>
        </div>
      </div>
      
      <div className="crystal-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-xl font-semibold mb-4">How to Use Today's Energy</h3>
        <p className="text-gray-700">
          {dailyProfile.numerologyData.meaning || dailyProfile.numerologyData.description}
        </p>
      </div>
    </div>
  );
};

export default InsightCards;
