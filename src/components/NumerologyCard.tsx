
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

  // Display all gems
  const getAllGems = () => {
    const gems = dailyProfile.numerologyData.gems || [];
    if (!gems.length) return "";
    
    return gems.join(", ");
  };

  // Get color values for display
  const getColorStyle = () => {
    const colors = dailyProfile.numerologyData.colors || [];
    
    if (!colors.length) return { backgroundColor: "#6B7280" };
    
    // Use the specific hex values
    const primaryColor = dailyProfile.numerologyData.colorHex || "#6B7280";
    const secondaryColor = dailyProfile.numerologyData.colorHexSecondary;
    const tertiaryColor = dailyProfile.numerologyData.colorHexTertiary;
    
    if (colors.length === 1) {
      return { 
        backgroundColor: primaryColor,
        backgroundImage: `radial-gradient(circle at 30% 30%, ${primaryColor}, transparent 80%)` 
      };
    }
    
    // For multiple colors, create a gradient
    if (colors.length === 2 && secondaryColor) {
      return {
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      };
    } else if (colors.length === 3 && secondaryColor && tertiaryColor) {
      return {
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${tertiaryColor} 100%)`
      };
    } else if (colors.length > 3 && secondaryColor) {
      // For "all pastels" or other multi-color scenarios
      return {
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      };
    }
    
    // Default fallback
    return { backgroundColor: primaryColor };
  };

  // Get individual color circles for the display
  const getColorCircles = () => {
    const colors = dailyProfile.numerologyData.colors || [];
    if (!colors.length) return null;
    
    // Use the specific hex values
    const primaryColor = dailyProfile.numerologyData.colorHex || "#6B7280";
    const secondaryColor = dailyProfile.numerologyData.colorHexSecondary;
    const tertiaryColor = dailyProfile.numerologyData.colorHexTertiary;
    const quaternaryColor = dailyProfile.numerologyData.colorHexQuaternary;
    
    return (
      <div className="flex items-center justify-center">
        {primaryColor && (
          <div 
            key="primary"
            className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float" 
            style={{ backgroundColor: primaryColor }}
          ></div>
        )}
        
        {secondaryColor && colors.length > 1 && (
          <div 
            key="secondary"
            className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float -ml-4" 
            style={{ backgroundColor: secondaryColor, zIndex: 1, animationDelay: "0.2s" }}
          ></div>
        )}
        
        {tertiaryColor && colors.length > 2 && (
          <div 
            key="tertiary"
            className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float -ml-4" 
            style={{ backgroundColor: tertiaryColor, zIndex: 0, animationDelay: "0.4s" }}
          ></div>
        )}

        {quaternaryColor && colors.length > 3 && (
          <div 
            key="quaternary"
            className="w-16 h-16 rounded-full mb-2 shadow-inner animate-float -ml-4" 
            style={{ backgroundColor: quaternaryColor, zIndex: 0, animationDelay: "0.6s" }}
          ></div>
        )}
      </div>
    );
  };

  // Function to determine if text color should be light or dark based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance using the formula for relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Get the best text color for the theme based on background color
  const getThemeTextStyle = () => {
    const baseColor = dailyProfile.numerologyData.colorHex || "#6B7280";
    const textColor = getContrastColor(baseColor);
    
    return {
      color: baseColor,
      textShadow: `0px 0px 3px ${textColor === "#FFFFFF" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)"}`,
      fontWeight: 'bold'
    };
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
            <div 
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={getThemeTextStyle()}
            >
              {dailyProfile.numerologyData.todaysTheme || dailyProfile.numerologyData.keyPhrase}
            </div>
            <p className="text-lg text-gray-700 max-w-md text-center md:text-left">
              Focus on embodying the energy of <strong>{(dailyProfile.numerologyData.todaysTheme || dailyProfile.numerologyData.keyPhrase).toLowerCase()}</strong> today 
              to align with your numerological vibration.
            </p>
          </div>
          
          <div className="bg-colorpath-lavender bg-opacity-20 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Colors</span>
            <div className="flex flex-col items-center">
              {getColorCircles()}
              <span className="text-xl font-medium mt-2">
                {dailyProfile.numerologyData.colors ? dailyProfile.numerologyData.colors.join(", ") : ""}
              </span>
            </div>
          </div>
          
          <div className="bg-colorpath-rose bg-opacity-10 flex flex-col justify-center items-center p-8 space-y-4">
            <span className="text-sm uppercase tracking-wider text-gray-500">Your Gems & Keyword</span>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 flex items-center justify-center animate-float">
                <div 
                  className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center transform rotate-45 overflow-hidden shadow-lg" 
                  style={{ background: `linear-gradient(45deg, ${dailyProfile.numerologyData.colorHex || "#6B7280"}44, ${dailyProfile.numerologyData.colorHex || "#6B7280"}99)` }}
                >
                  <span className="transform -rotate-45 text-white font-bold">✧</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xl font-medium">{getAllGems()}</span>
                <div className="mt-2 text-xl font-medium">
                  <span className="px-3 py-1 bg-gray-100 rounded-full" style={{ color: dailyProfile.numerologyData.colorHex || 'inherit' }}>
                    {dailyProfile.numerologyData.keyWord || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerologyCard;
