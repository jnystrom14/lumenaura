
import React from "react";
import { DateRange } from "react-day-picker";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";
import NavigationButtons from "./NavigationButtons";
import ViewToggleButtons from "./ViewToggleButtons";

interface MobileControlsProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  isRangeMode: boolean;
  setIsRangeMode: (isRange: boolean) => void;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
  handleDateRangeSelection: () => void;
  setShowMonthly: (show: boolean) => void;
  onLogout: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange,
  isRangeMode,
  setIsRangeMode,
  handlePreviousDay,
  handleNextDay,
  handleDateRangeSelection,
  setShowMonthly,
  onLogout,
}) => {
  return (
    <div className="space-y-4">
      {/* Date Navigation Controls */}
      <div className="flex items-center justify-between bg-white/50 rounded-lg p-2 shadow-sm">
        <NavigationButtons 
          onPreviousDay={handlePreviousDay} 
          onNextDay={handleNextDay} 
          isMobile={true} 
        />
        
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isRangeMode={isRangeMode}
          setIsRangeMode={setIsRangeMode}
          isMobile={true}
        />
      </div>
      
      {/* View Options */}
      <div className="grid grid-cols-2 gap-2">
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedDate={selectedDate}
          isRangeMode={isRangeMode}
          onDateRangeSelection={handleDateRangeSelection}
          isMobile={true}
        />
        
        <ViewToggleButtons 
          setShowMonthly={setShowMonthly} 
          onLogout={onLogout} 
          isMobile={true} 
        />
      </div>
    </div>
  );
};

export default MobileControls;
