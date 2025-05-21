
import React from "react";
import { DailyProfile } from "../types";
import { Separator } from "./ui/separator";
import { useIsMobile } from "../hooks/use-mobile";
import { getColorStyle } from "../utils/colorUtils";
import ThemePanel from "./numerology/ThemePanel";
import ColorPanel from "./numerology/ColorPanel";
import GemPanel from "./numerology/GemPanel";
import KeywordPanel from "./numerology/KeywordPanel";

interface NumerologyCardProps {
  dailyProfile: DailyProfile;
}

const NumerologyCard: React.FC<NumerologyCardProps> = ({ dailyProfile }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="crystal-card overflow-hidden">
      <div className="relative p-6">
        <div 
          className="absolute inset-0 opacity-10" 
          style={getColorStyle(
            dailyProfile.numerologyData.colors,
            dailyProfile.numerologyData.colorHex,
            dailyProfile.numerologyData.colorHexSecondary,
            dailyProfile.numerologyData.colorHexTertiary
          )}
        ></div>
        
        {/* Responsive layout - grid for desktop, stacked for mobile */}
        <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-4 gap-0'}`}>
          {/* Today's Theme Panel */}
          <div className="relative">
            <ThemePanel 
              numerologyData={dailyProfile.numerologyData} 
              isMobile={isMobile} 
            />
            {!isMobile && (
              <div className="absolute right-0 h-full top-0 opacity-50">
                <Separator orientation="vertical" className="h-full bg-lumenaura-lavender" />
              </div>
            )}
          </div>
          
          {/* Your Colors Panel */}
          <div className="relative">
            <ColorPanel 
              numerologyData={dailyProfile.numerologyData} 
              isMobile={isMobile} 
            />
            {!isMobile && (
              <div className="absolute right-0 h-full top-0 opacity-50">
                <Separator orientation="vertical" className="h-full bg-lumenaura-lavender" />
              </div>
            )}
          </div>
          
          {/* Your Gems Panel */}
          <div className="relative">
            <GemPanel 
              numerologyData={dailyProfile.numerologyData} 
              isMobile={isMobile} 
            />
            {!isMobile && (
              <div className="absolute right-0 h-full top-0 opacity-50">
                <Separator orientation="vertical" className="h-full bg-lumenaura-lavender" />
              </div>
            )}
          </div>
          
          {/* Your Keyword Panel */}
          <KeywordPanel numerologyData={dailyProfile.numerologyData} />
        </div>
      </div>
    </div>
  );
};

export default NumerologyCard;
