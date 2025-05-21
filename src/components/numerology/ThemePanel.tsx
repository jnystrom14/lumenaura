
import React from "react";
import { NumerologyData } from "../../types";

interface ThemePanelProps {
  numerologyData: NumerologyData;
  isMobile: boolean;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ numerologyData, isMobile }) => {
  // Get the best text color for the theme based on background color
  const getThemeTextStyle = () => {
    const baseColor = numerologyData.colorHex || "#6B7280";
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

  return (
    <div className={`flex flex-col items-center px-4 relative ${isMobile ? 'pb-6' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Today's Theme</h3>
      <div 
        className="text-xl font-serif font-bold text-center mt-2"
        style={getThemeTextStyle()}
      >
        {numerologyData.todaysTheme || numerologyData.keyPhrase}
      </div>
      {isMobile && <div className="w-full mt-6 bg-lumenaura-lavender opacity-50" />}
    </div>
  );
};

export default ThemePanel;
