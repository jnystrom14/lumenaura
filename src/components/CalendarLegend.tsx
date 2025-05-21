
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsLargerThan, useIsSmallerThan } from "@/hooks/use-responsive";
import { Gem } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define our color groups with their hex values
const COLOR_GROUPS = {
  PURPLE: {
    colors: ["Purple", "Violet"],
    colorHexes: ["#9b87f5", "#7E69AB"]
  },
  BEIGE: {
    colors: ["Beige", "Brown", "Pink"],
    colorHexes: ["#f5f5dc", "#a52a2a", "#ffc0cb"]
  },
  BLACK: {
    colors: ["Black", "White", "Pearl Gray"],
    colorHexes: ["#000000", "#ffffff", "#e6e6e6"]
  },
  CORAL: {
    colors: ["Coral", "Russet"],
    colorHexes: ["#ff7f50", "#80461b"]
  }
};

// Define our gem groups
const GEM_GROUPS = {
  EMERALD: {
    gems: ["Emerald", "Jade"],
    iconColor: "#50C878" // Emerald green
  },
  TURQUOISE: {
    gems: ["Turquoise", "Aquamarine"],
    iconColor: "#40E0D0" // Turquoise blue
  },
  PEARL: {
    gems: ["Pearl", "Sapphire", "Lapis"],
    iconColor: "#F0F8FF" // Pearl white
  },
  OPAL: {
    gems: ["Opal", "Gold"],
    iconColor: "#FFDEAD" // Light gold/opal color
  },
  CORAL: {
    gems: ["Coral", "Copper"],
    iconColor: "#FF7F50" // Coral red
  }
};

// Component for displaying multiple intersecting color balls
const ColorBallGroup = ({ colorHexes, size = "w-4 h-4", mobileSize = "w-3 h-3" }: { 
  colorHexes: string[], 
  size?: string, 
  mobileSize?: string 
}) => {
  const isMobile = useIsMobile();
  const isExtraSmall = useIsSmallerThan('xs');
  
  const ballSize = isExtraSmall ? "w-2 h-2" : isMobile ? mobileSize : size;
  
  return (
    <div className="flex -space-x-2 flex-shrink-0">
      {colorHexes.map((colorHex, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-full border border-gray-100",
            ballSize,
            "print:w-2 print:h-2"
          )}
          style={{ 
            backgroundColor: colorHex,
            zIndex: colorHexes.length - index,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact"
          }}
        />
      ))}
    </div>
  );
};

// Component for displaying multiple gem icons
const GemGroup = ({ gems, iconColor, size = "w-4 h-4", mobileSize = "w-3 h-3" }: {
  gems: string[],
  iconColor: string,
  size?: string,
  mobileSize?: string
}) => {
  const isMobile = useIsMobile();
  const isExtraSmall = useIsSmallerThan('xs');
  
  const gemSize = isExtraSmall ? "w-2 h-2" : isMobile ? mobileSize : size;
  
  return (
    <div className="flex -space-x-1 flex-shrink-0">
      {gems.map((_, index) => (
        <Gem
          key={index}
          className={cn(
            gemSize,
            "print:w-2 print:h-2"
          )}
          style={{ 
            color: iconColor,
            zIndex: gems.length - index,
            transform: `translateX(${index * 2}px)`,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact"
          }}
        />
      ))}
    </div>
  );
};

const CalendarLegend: React.FC = () => {
  const isMobile = useIsMobile();
  const isExtraSmall = useIsSmallerThan('xs');
  const isLargerThanMobile = useIsLargerThan('md');
  
  return (
    <div className={cn(
      "mt-4 p-3 rounded-md bg-white bg-opacity-50 border border-lumenaura-lavender border-opacity-30",
      isExtraSmall ? "p-2" : "",
      "print:mt-2 print:p-1 print:border print:border-gray-200"
    )}>
      <h3 className={cn(
        "text-sm font-medium mb-2",
        isExtraSmall ? "text-xs mb-1" : isMobile ? "text-xs" : "",
        "print:text-xs print:mb-1"
      )}>
        Legend
      </h3>
      
      <div className={cn(
        "flex flex-col space-y-3",
        isExtraSmall ? "space-y-2" : "",
        isExtraSmall ? "text-[10px]" : isMobile ? "text-xs" : "text-sm",
        "print:text-xs"
      )}>
        {/* Colors Section */}
        <div className="space-y-1">
          <h4 className={cn(
            "text-xs font-medium text-muted-foreground mb-1",
            isExtraSmall ? "text-[10px] mb-0.5" : ""
          )}>
            Colors
          </h4>
          <div className="flex flex-col space-y-1">
            {Object.values(COLOR_GROUPS).map((group, index) => (
              <div key={`color-${index}`} className="flex items-center gap-2">
                <div className="w-8 flex-shrink-0">
                  <ColorBallGroup 
                    colorHexes={group.colorHexes}
                    size="w-4 h-4"
                    mobileSize={isExtraSmall ? "w-2 h-2" : "w-3 h-3"}
                  />
                </div>
                <span className="truncate">
                  {group.colors.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Separator */}
        <Separator className="my-1 bg-lumenaura-lavender/20" />
        
        {/* Gems Section */}
        <div className="space-y-1">
          <h4 className={cn(
            "text-xs font-medium text-muted-foreground mb-1",
            isExtraSmall ? "text-[10px] mb-0.5" : ""
          )}>
            Gems
          </h4>
          <div className="flex flex-col space-y-1">
            {Object.values(GEM_GROUPS).map((group, index) => (
              <div key={`gem-${index}`} className="flex items-center gap-2">
                <div className="w-8 flex-shrink-0">
                  <GemGroup 
                    gems={group.gems}
                    iconColor={group.iconColor}
                    size="w-4 h-4"
                    mobileSize={isExtraSmall ? "w-2 h-2" : "w-3 h-3"}
                  />
                </div>
                <span className="truncate">
                  {group.gems.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;
