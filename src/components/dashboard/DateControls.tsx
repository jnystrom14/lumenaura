import React from "react";
import { addDays, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileControls from "./date-controls/MobileControls";
import DesktopControls from "./date-controls/DesktopControls";

interface DateControlsProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  isRangeMode: boolean;
  setIsRangeMode: (isRange: boolean) => void;
  setShowMonthly: (show: boolean) => void;
  setShowDateRange: (show: boolean) => void;
  onLogout: () => void;
}

const DateControls: React.FC<DateControlsProps> = ({
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange,
  isRangeMode,
  setIsRangeMode,
  setShowMonthly,
  setShowDateRange,
  onLogout,
}) => {
  const isMobile = useIsMobile();
  
  const handleDateRangeSelection = () => {
    if (dateRange?.from && dateRange?.to) {
      setIsRangeMode(false);
      setSelectedDate(dateRange.from);
      setShowDateRange(true);
    }
  };

  const handlePreviousDay = () => {
    const previousDay = subDays(selectedDate, 1);
    setSelectedDate(previousDay);
    setIsRangeMode(false);
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    setIsRangeMode(false);
  };

  if (isMobile) {
    return (
      <MobileControls
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isRangeMode={isRangeMode}
        setIsRangeMode={setIsRangeMode}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
        handleDateRangeSelection={handleDateRangeSelection}
        setShowMonthly={setShowMonthly}
        onLogout={onLogout}
      />
    );
  }
  
  // Desktop layout
  return (
    <DesktopControls
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isRangeMode={isRangeMode}
      setIsRangeMode={setIsRangeMode}
      handlePreviousDay={handlePreviousDay}
      handleNextDay={handleNextDay}
      handleDateRangeSelection={handleDateRangeSelection}
      setShowMonthly={setShowMonthly}
      onLogout={onLogout}
    />
  );
};

export default DateControls;
