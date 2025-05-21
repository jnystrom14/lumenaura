
import React from "react";
import { NumerologyData } from "../../types";

interface ColorPanelProps {
  numerologyData: NumerologyData;
  isMobile: boolean;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ numerologyData, isMobile }) => {
  // Get individual color circles for the display
  const getColorCircles = () => {
    const colors = numerologyData.colors || [];
    if (!colors.length) return null;
    
    // Use the specific hex values
    const primaryColor = numerologyData.colorHex || "#6B7280";
    const secondaryColor = numerologyData.colorHexSecondary;
    const tertiaryColor = numerologyData.colorHexTertiary;
    const quaternaryColor = numerologyData.colorHexQuaternary;
    
    return (
      <div className="flex items-center justify-center">
        {primaryColor && (
          <div 
            key="primary"
            className="w-10 h-10 rounded-full shadow-inner" 
            style={{ backgroundColor: primaryColor }}
          ></div>
        )}
        
        {secondaryColor && colors.length > 1 && (
          <div 
            key="secondary"
            className="w-10 h-10 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: secondaryColor, zIndex: 1 }}
          ></div>
        )}
        
        {tertiaryColor && colors.length > 2 && (
          <div 
            key="tertiary"
            className="w-10 h-10 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: tertiaryColor, zIndex: 0 }}
          ></div>
        )}

        {quaternaryColor && colors.length > 3 && (
          <div 
            key="quaternary"
            className="w-10 h-10 rounded-full shadow-inner -ml-3" 
            style={{ backgroundColor: quaternaryColor, zIndex: 0 }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center px-4 relative ${isMobile ? 'pb-6' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Colors</h3>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center">
          {getColorCircles()}
        </div>
        <span className="text-sm font-medium mt-2 text-center">
          {numerologyData.colors ? numerologyData.colors.join(", ") : ""}
        </span>
      </div>
      {isMobile && <div className="w-full mt-6 bg-lumenaura-lavender opacity-50" />}
    </div>
  );
};

export default ColorPanel;
