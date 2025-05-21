
import React from "react";
import { Button } from "@/components/ui/button";
import { logWithEmoji } from "@/utils/consoleLogger";

interface ViewToggleButtonsProps {
  setShowMonthly: (show: boolean) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

const ViewToggleButtons: React.FC<ViewToggleButtonsProps> = ({
  setShowMonthly,
  onLogout,
  isMobile = false,
}) => {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logWithEmoji("Logout button clicked", 'info');
    onLogout();
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowMonthly(true)}
          className="border-lumenaura-lavender text-sm h-10"
        >
          Monthly View
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowMonthly(true)}
        className="border-lumenaura-lavender"
      >
        Monthly View
      </Button>
      <Button
        variant="ghost"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
};

export default ViewToggleButtons;
