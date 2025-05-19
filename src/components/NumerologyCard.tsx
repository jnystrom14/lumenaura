
import React from "react";
import { DailyProfile } from "../types";

interface NumerologyCardProps {
  dailyProfile: DailyProfile;
}

const NumerologyCard: React.FC<NumerologyCardProps> = ({ dailyProfile }) => {
  // Function to get first item safely or provide a fallback
  const getFirstItem = (arr: string[] | undefined, fallback: string = ""): string => {
    return arr && arr.length > 0 ? arr[0] : fallback;
  };

  // Create a gradient for multiple colors
  const getColorStyle = () => {
    const colors = dailyProfile.numerologyData.colors || [];
    
    if (!colors.length) return { backgroundColor: "#6B7280" };
    
    if (colors.length === 1) {
      return { 
        backgroundColor: dailyProfile.numerologyData.colorHex || "#6B7280",
        backgroundImage: `radial-gradient(circle at 30% 30%, ${dailyProfile.numerologyData.colorHex || "#6B7280"}, transparent 80%)` 
      };
    }
    
    // For multiple colors, create a gradient
    const colorStops = colors.map((_, i) => {
      const percent = (i * 100) / (colors.length - 1);
      return `${percent}%`;
    });
    
    return {
      background: `linear-gradient(135deg, ${colors.map((c, i) => `${dailyProfile.numerologyData.colorHex || "#6B7280"} ${colorStops[i]}`).join(', ')})`
    };
  };

  // Display all gems
  const getAllGems = () => {
    const gems = dailyProfile.numerologyData.gems || [];
    if (!gems.length) return "";
    
    return gems.join(", ");
  };

  return (
    <div className="crystal-card overflow-hidden">
      <div className="relative">
        <div 
          className="absolute inset-0 opacity-10" 
          style={getColorStyle()}
        ></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div className="p-8 md:col-span-2 lg:col-span-2 flex flex-col justify-center items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Today's Theme:
            </h2>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
              {dailyProfile.numerologyData.powerWord || dailyProfile.numerologyData.keyPhrase}
            </div>
            <p className="text-lg text-gray-700 max-w-md text-center md:text-left">
              Focus on embodying the energy of <strong>{(dailyProfile.numerologyData.powerWord || dailyProfile.numerologyData.keyPhrase).toLowerCase()}</strong> today 
              to align with your numerological vibration.
            </p>
          </div>
          
          <div className="bg-colorpath-lavender bg-opacity-20 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Colors</span>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                {dailyProfile.numerologyData.colors && dailyProfile.numerologyData.colors.length > 0 ? (
                  dailyProfile.numerologyData.colors.map((color, index) => (
                    <div 
                      key={index}
                      className={`w-16 h-16 rounded-full mb-2 shadow-inner animate-float ${index > 0 ? '-ml-4' : ''}`} 
                      style={{ 
                        backgroundColor: dailyProfile.numerologyData.colorHex || "#6B7280",
                        zIndex: dailyProfile.numerologyData.colors!.length - index
                      }}
                    ></div>
                  ))
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float" 
                    style={{ backgroundColor: "#6B7280" }}
                  ></div>
                )}
              </div>
              <span className="text-xl font-medium">
                {dailyProfile.numerologyData.colors ? dailyProfile.numerologyData.colors.join(", ") : ""}
              </span>
            </div>
          </div>
          
          <div className="bg-colorpath-rose bg-opacity-10 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Gems</span>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center animate-float">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center transform rotate-45 overflow-hidden shadow-lg" style={{ background: `linear-gradient(45deg, ${dailyProfile.numerologyData.colorHex || "#6B7280"}44, ${dailyProfile.numerologyData.colorHex || "#6B7280"}99)` }}>
                  <span className="transform -rotate-45 text-white font-bold">✧</span>
                </div>
              </div>
              <span className="text-xl font-medium">{getAllGems()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerologyCard;
