
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
            className="w-12 h-12 rounded-full shadow-inner" 
            style={{ backgroundColor: primaryColor }}
          ></div>
        )}
        
        {secondaryColor && colors.length > 1 && (
          <div 
            key="secondary"
            className="w-12 h-12 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: secondaryColor, zIndex: 1 }}
          ></div>
        )}
        
        {tertiaryColor && colors.length > 2 && (
          <div 
            key="tertiary"
            className="w-12 h-12 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: tertiaryColor, zIndex: 0 }}
          ></div>
        )}

        {quaternaryColor && colors.length > 3 && (
          <div 
            key="quaternary"
            className="w-12 h-12 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: quaternaryColor, zIndex: 0 }}
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
    
    // Enhanced style with better visibility and contrast
    return {
      color: textColor,
      backgroundColor: baseColor,
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    };
  };

  return (
    <div className="crystal-card overflow-hidden">
      <div className="relative">
        <div 
          className="absolute inset-0 opacity-10" 
          style={getColorStyle()}
        ></div>
        
        <div className="grid grid-cols-1 gap-4 p-6">
          {/* Today's Theme Section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-semibold">
                Today's Theme:
              </h2>
              <div 
                className="text-2xl md:text-3xl font-serif font-bold inline-block"
                style={getThemeTextStyle()}
              >
                {dailyProfile.numerologyData.todaysTheme || dailyProfile.numerologyData.keyPhrase}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 italic max-w-md text-center md:text-right">
              Focus on embodying this energy today to align with your numerological vibration.
            </p>
          </div>
          
          {/* Horizontal Card Layout for Colors, Gems, and Keyword */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Colors Section */}
            <div className="bg-colorpath-lavender bg-opacity-20 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white bg-opacity-50 p-2 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Your Colors</h3>
              </div>
              <div className="flex items-center gap-2">
                {getColorCircles()}
                <span className="text-sm font-medium ml-2">
                  {dailyProfile.numerologyData.colors ? dailyProfile.numerologyData.colors.join(", ") : ""}
                </span>
              </div>
            </div>
            
            {/* Gems Section */}
            <div className="bg-colorpath-rose bg-opacity-10 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white bg-opacity-50 p-2 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Your Gems</h3>
              </div>
              <div className="text-center md:text-left">
                <span className="text-sm font-medium">{getAllGems()}</span>
              </div>
            </div>
            
            {/* Keyword Section */}
            <div className="bg-colorpath-teal bg-opacity-20 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white bg-opacity-50 p-2 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Your Keyword</h3>
              </div>
              <div className="px-3 py-1 bg-white bg-opacity-70 rounded-full" style={{ color: dailyProfile.numerologyData.colorHex || 'inherit' }}>
                <span className="font-medium">{dailyProfile.numerologyData.keyWord || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerologyCard;
