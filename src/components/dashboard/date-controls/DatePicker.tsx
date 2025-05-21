
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isRangeMode: boolean;
  setIsRangeMode: (isRange: boolean) => void;
  isMobile?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  isRangeMode,
  setIsRangeMode,
  isMobile = false,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={!isRangeMode ? "default" : "outline"}
          className={
            isMobile ? "flex-1 mx-2 text-sm" : "flex items-center space-x-2"
          }
        >
          <CalendarIcon className={isMobile ? "h-4 w-4 mr-1 flex-shrink-0" : "h-4 w-4"} />
          <span className={isMobile ? "truncate" : ""}>
            {!isRangeMode ? format(selectedDate, isMobile ? "MMM d, yyyy" : "MMM d, yyyy") : "Select date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setIsRangeMode(false);
              }
            }}
            className="touch-manipulation"
            initialFocus={!isMobile}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
