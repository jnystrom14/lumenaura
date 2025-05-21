
import React from "react";
import { NumerologyData } from "../../types";

interface KeywordPanelProps {
  numerologyData: NumerologyData;
}

const KeywordPanel: React.FC<KeywordPanelProps> = ({ numerologyData }) => {
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
    <div className="flex flex-col items-center px-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Keyword</h3>
      <div 
        className="px-4 py-2 bg-opacity-80 rounded-full text-center mt-2"
        style={{ 
          backgroundColor: numerologyData.colorHex || 'white',
          color: getContrastColor(numerologyData.colorHex || '#FFFFFF')
        }}
      >
        <span className="font-medium">{numerologyData.keyWord || numerologyData.powerWord || ""}</span>
      </div>
    </div>
  );
};

export default KeywordPanel;
