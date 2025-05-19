
import React from "react";
import { format, addDays, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
      const days = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      toast({
        title: "Date range selected",
        description: `You selected ${days} days from ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}`,
      });
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

  return (
    <div className="flex flex-wrap gap-2">
      {/* Date Navigation Arrows */}
      <div className="flex items-center">
        <Button
          variant="outline" 
          size="icon"
          onClick={handlePreviousDay}
          className="mr-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Single Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={!isRangeMode ? "default" : "outline"}
              className="flex items-center space-x-2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{!isRangeMode ? format(selectedDate, "MMM d, yyyy") : "Select a date"}</span>
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
                initialFocus={!isMobile}
                className="touch-manipulation"
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline" 
          size="icon"
          onClick={handleNextDay}
          className="ml-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={isRangeMode ? "default" : "outline"}
            className="flex items-center space-x-2"
          >
            <CalendarRange className="h-4 w-4" />
            <span>
              {isRangeMode && dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                : "Date range"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <div className="p-3">
            <Calendar
              initialFocus={!isMobile}
              mode="range"
              defaultMonth={selectedDate}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setIsRangeMode(true);
              }}
              numberOfMonths={isMobile ? 1 : 2}
              className="touch-manipulation"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={handleDateRangeSelection}
                disabled={!dateRange?.from || !dateRange?.to}
              >
                View Date Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant="outline"
        onClick={() => setShowMonthly(true)}
        className="border-lumenaura-lavender"
      >
        Monthly View
      </Button>
      
      <Button
        variant="ghost"
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default DateControls;
