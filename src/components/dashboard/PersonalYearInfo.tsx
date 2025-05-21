
import React from "react";
import { DailyProfile } from "../../types";
import { useIsMobile } from "../../hooks/use-mobile";

interface PersonalYearInfoProps {
  dailyProfile: DailyProfile;
}

const PersonalYearInfo: React.FC<PersonalYearInfoProps> = ({ dailyProfile }) => {
  const personalYear = dailyProfile.personalYear;
  const personalYearData = dailyProfile.personalYearData.personalYear;
  const isMobile = useIsMobile();

  if (!personalYearData) {
    return null;
  }

  return (
    <div className="crystal-card p-6 animate-fade-in my-6">
      <div className="mb-4">
        <h3 className={`${isMobile ? 'text-xl' : 'text-xl'} font-semibold`}>Your Personal Year: {personalYear}</h3>
      </div>
      
      <div className={`prose ${isMobile ? 'prose-base' : 'prose-lg'} text-gray-700`}>
        <p className={`${isMobile ? 'text-lg' : 'text-lg'} italic font-medium mb-4`}>
          {personalYearData.description.split('!')[0]}!
        </p>
        
        <p className={`${isMobile ? 'text-base leading-relaxed' : 'text-base'} text-gray-600`}>
          {personalYearData.description.split('!').slice(1).join('!')}
        </p>
      </div>
    </div>
  );
};

export default PersonalYearInfo;
