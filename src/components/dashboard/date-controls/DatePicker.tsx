import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsRangeMode(false);
      // Auto-close the popover after selection
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={!isRangeMode ? "default" : "outline"}
          className={
            isMobile ? "w-full text-sm h-10" : "flex items-center space-x-2"
          }
        >
          <CalendarIcon className={isMobile ? "h-4 w-4 mr-1 flex-shrink-0" : "h-4 w-4"} />
          <span className={isMobile ? "truncate" : ""}>
            {!isRangeMode ? format(selectedDate, isMobile ? "MMM d" : "MMM d, yyyy") : "Select date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="touch-manipulation"
            initialFocus={!isMobile}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
