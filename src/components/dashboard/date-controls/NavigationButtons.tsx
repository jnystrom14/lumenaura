
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPreviousDay: () => void;
  onNextDay: () => void;
  isMobile?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPreviousDay,
  onNextDay,
  isMobile = false,
  showPrevious = true,
  showNext = true,
}) => {
  if (isMobile) {
    return (
      <>
        {showPrevious && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousDay}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Prev
          </Button>
        )}
        {showNext && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNextDay}
            className="flex-shrink-0"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      {showPrevious && (
        <Button
          variant="outline" 
          size="icon"
          onClick={onPreviousDay}
          className="mr-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {showNext && (
        <Button
          variant="outline" 
          size="icon"
          onClick={onNextDay}
          className="ml-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default NavigationButtons;
