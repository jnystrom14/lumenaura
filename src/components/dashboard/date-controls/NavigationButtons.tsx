
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPreviousDay?: () => void;
  onNextDay?: () => void;
  isMobile?: boolean;
  variant?: "previous" | "next";
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPreviousDay,
  onNextDay,
  isMobile = false,
  variant,
}) => {
  if (isMobile) {
    if (variant === "previous") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousDay}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Prev
        </Button>
      );
    }
    
    if (variant === "next") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onNextDay}
          className="flex-shrink-0"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      );
    }

    // Default case: render both buttons
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousDay}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextDay}
          className="flex-shrink-0"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </>
    );
  }

  // Desktop version
  if (variant === "previous") {
    return (
      <Button
        variant="outline" 
        size="icon"
        onClick={onPreviousDay}
        className="mr-1"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
  }
  
  if (variant === "next") {
    return (
      <Button
        variant="outline" 
        size="icon"
        onClick={onNextDay}
        className="ml-1"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
  }

  // Default case: render both buttons
  return (
    <>
      <Button
        variant="outline" 
        size="icon"
        onClick={onPreviousDay}
        className="mr-1"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline" 
        size="icon"
        onClick={onNextDay}
        className="ml-1"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default NavigationButtons;
