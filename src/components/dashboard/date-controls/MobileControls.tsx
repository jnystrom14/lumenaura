import React from "react";
import { DateRange } from "react-day-picker";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";
import NavigationButtons from "./NavigationButtons";
import ViewToggleButtons from "./ViewToggleButtons";
import { Button } from "@/components/ui/button";

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
      {/* Date Navigation Controls - prev | date picker | next */}
      <div className="flex items-center justify-center bg-white/50 rounded-lg p-3 shadow-sm gap-2">
        <NavigationButtons 
          onPreviousDay={handlePreviousDay} 
          variant="previous"
          isMobile={true} 
        />
        
        <div className="flex-1 max-w-[200px]">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isRangeMode={isRangeMode}
            setIsRangeMode={setIsRangeMode}
            isMobile={true}
          />
        </div>
        
        <NavigationButtons 
          onNextDay={handleNextDay} 
          variant="next"
          isMobile={true} 
        />
      </div>
      
      {/* Bottom row - Date Range and View Options */}
      <div className="space-y-3">
        {/* Date Range Picker - full width */}
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedDate={selectedDate}
          isRangeMode={isRangeMode}
          onDateRangeSelection={handleDateRangeSelection}
          isMobile={true}
        />
        
        {/* Monthly and Logout buttons side by side */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowMonthly(true)}
            className="border-lumenaura-lavender text-sm h-10"
          >
            Monthly View
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-sm h-10"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
