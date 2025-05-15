
import React from "react";
import { DailyProfile } from "../types";

interface NumerologyCardProps {
  dailyProfile: DailyProfile;
}

const NumerologyCard: React.FC<NumerologyCardProps> = ({ dailyProfile }) => {
  return (
    <div className="crystal-card overflow-hidden">
      <div className="relative">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundColor: dailyProfile.numerologyData.colorHex,
            backgroundImage: `radial-gradient(circle at 30% 30%, ${dailyProfile.numerologyData.colorHex}, transparent 80%)` 
          }}
        ></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          <div className="p-8 md:col-span-2 lg:col-span-2 flex flex-col justify-center items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Today's Power Word:
            </h2>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              {dailyProfile.numerologyData.powerWord}
            </div>
            <p className="text-lg text-gray-700 max-w-md text-center md:text-left">
              Focus on embodying the energy of <strong>{dailyProfile.numerologyData.powerWord.toLowerCase()}</strong> today 
              to align with your numerological vibration.
            </p>
          </div>
          
          <div className="bg-colorpath-lavender bg-opacity-20 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Color</span>
            <div className="flex flex-col items-center">
              <div 
                className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float" 
                style={{ backgroundColor: dailyProfile.numerologyData.colorHex }}
              ></div>
              <span className="text-xl font-medium">{dailyProfile.numerologyData.color}</span>
            </div>
          </div>
          
          <div className="bg-colorpath-rose bg-opacity-10 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Gem</span>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center animate-float">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center transform rotate-45 overflow-hidden shadow-lg" style={{ background: `linear-gradient(45deg, ${dailyProfile.numerologyData.colorHex}44, ${dailyProfile.numerologyData.colorHex}99)` }}>
                  <span className="transform -rotate-45 text-white font-bold">✧</span>
                </div>
              </div>
              <span className="text-xl font-medium">{dailyProfile.numerologyData.gem}</span>
            </div>
          </div>
          
          <div className="bg-colorpath-teal bg-opacity-10 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Lucky Number</span>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary animate-float">{dailyProfile.numerologyData.luckyNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerologyCard;
