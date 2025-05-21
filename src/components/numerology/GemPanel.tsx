
import React from "react";
import { NumerologyData } from "../../types";
import { Gem } from "lucide-react";

interface GemPanelProps {
  numerologyData: NumerologyData;
  isMobile: boolean;
}

const GemPanel: React.FC<GemPanelProps> = ({ numerologyData, isMobile }) => {
  // Display all gems
  const getAllGems = () => {
    const gems = numerologyData.gems || [];
    if (!gems.length) return "";
    
    return gems.join(", ");
  };

  // Function to determine if the gem icon needs an outline based on color brightness
  const getGemStyle = () => {
    const gemColor = numerologyData.colorHex || '#6B7280';
    
    // Convert hex to RGB
    const r = parseInt(gemColor.slice(1, 3), 16);
    const g = parseInt(gemColor.slice(3, 5), 16);
    const b = parseInt(gemColor.slice(5, 7), 16);
    
    // Calculate luminance using the formula for relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Add outline for lighter colors (higher luminance values)
    if (luminance > 0.6) {
      return { 
        color: gemColor,
        stroke: "#000000", 
        strokeWidth: "1px"
      };
    }
    
    return { color: gemColor };
  };

  return (
    <div className={`flex flex-col items-center px-4 relative ${isMobile ? 'pb-6' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Gems</h3>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center">
          <Gem 
            size={32} 
            className="mb-1" 
            style={getGemStyle()}
          />
        </div>
        <span className="text-sm font-medium text-center">
          {getAllGems()}
        </span>
      </div>
      {isMobile && <div className="w-full mt-6 bg-lumenaura-lavender opacity-50" />}
    </div>
  );
};

export default GemPanel;
