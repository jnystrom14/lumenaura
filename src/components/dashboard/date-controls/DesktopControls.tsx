
import React from "react";
import { DateRange } from "react-day-picker";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";
import NavigationButtons from "./NavigationButtons";
import ViewToggleButtons from "./ViewToggleButtons";

interface DesktopControlsProps {
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

const DesktopControls: React.FC<DesktopControlsProps> = ({
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
    <div className="flex flex-wrap gap-2">
      {/* Date Navigation and Picker with explicit order */}
      <div className="flex items-center">
        {/* Previous Button */}
        <div className="order-1">
          <NavigationButtons 
            onPreviousDay={handlePreviousDay}
            variant="previous"
          />
        </div>
        
        {/* Single Date Picker */}
        <div className="order-2 mx-1">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isRangeMode={isRangeMode}
            setIsRangeMode={setIsRangeMode}
          />
        </div>
        
        {/* Next Button */}
        <div className="order-3">
          <NavigationButtons 
            onNextDay={handleNextDay}
            variant="next"
          />
        </div>
      </div>
      
      {/* Date Range Picker */}
      <DateRangePicker
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedDate={selectedDate}
        isRangeMode={isRangeMode}
        onDateRangeSelection={handleDateRangeSelection}
      />
      
      <ViewToggleButtons 
        setShowMonthly={setShowMonthly} 
        onLogout={onLogout} 
      />
    </div>
  );
};

export default DesktopControls;
