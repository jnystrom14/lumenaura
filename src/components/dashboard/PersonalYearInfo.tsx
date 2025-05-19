
import React from "react";
import { DailyProfile } from "../../types";

interface PersonalYearInfoProps {
  dailyProfile: DailyProfile;
}

const PersonalYearInfo: React.FC<PersonalYearInfoProps> = ({ dailyProfile }) => {
  const personalYear = dailyProfile.personalYear;
  const personalYearData = dailyProfile.numerologyData.personalYear;

  if (!personalYearData) {
    return null;
  }

  return (
    <div className="crystal-card p-6 animate-fade-in my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Personal Year: {personalYear}</h3>
        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
          {personalYearData.yearNumber}
        </span>
      </div>
      
      <div className="prose prose-lg text-gray-700">
        <p className="italic font-medium mb-4">
          {personalYearData.description.split('!')[0]}!
        </p>
        
        <p className="text-gray-600">
          {personalYearData.description.split('!').slice(1).join('!')}
        </p>
      </div>
    </div>
  );
};

export default PersonalYearInfo;
