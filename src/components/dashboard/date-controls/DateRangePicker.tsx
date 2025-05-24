import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedDate: Date;
  isRangeMode: boolean;
  onDateRangeSelection: () => void;
  isMobile?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  setDateRange,
  selectedDate,
  isRangeMode,
  onDateRangeSelection,
  isMobile = false,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isRangeMode ? "default" : "outline"}
          className={isMobile ? "w-full flex items-center justify-center text-sm h-10" : "flex items-center space-x-2"}
        >
          <CalendarRange className={isMobile ? "h-4 w-4 mr-1 flex-shrink-0" : "h-4 w-4"} />
          <span className={isMobile ? "truncate" : ""}>
            {isRangeMode && dateRange?.from && dateRange?.to
              ? isMobile
                ? `${format(dateRange.from, "M/d")} - ${format(dateRange.to, "M/d")}`
                : `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
              : "Date range"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto">
        <div className="p-3">
          <Calendar
            mode="range"
            defaultMonth={selectedDate}
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range);
            }}
            numberOfMonths={1}
            className="touch-manipulation"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              onClick={onDateRangeSelection}
              disabled={!dateRange?.from || !dateRange?.to}
              className={isMobile ? "text-sm" : ""}
            >
              View Date Range
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
