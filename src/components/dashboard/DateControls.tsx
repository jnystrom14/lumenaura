
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
    <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex flex-wrap gap-2'}`}>
      {/* Date Navigation Arrows */}
      <div className={`flex items-center ${isMobile ? 'w-full justify-between' : ''}`}>
        <Button
          variant="outline" 
          size={isMobile ? "default" : "icon"}
          onClick={handlePreviousDay}
          className={isMobile ? "px-4 py-2 text-base" : "mr-1"}
        >
          <ChevronLeft className={isMobile ? "h-5 w-5 mr-1" : "h-4 w-4"} />
          {isMobile && "Previous"}
        </Button>
        
        {/* Single Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={!isRangeMode ? "default" : "outline"}
              className={`flex items-center space-x-2 ${isMobile ? 'text-base flex-1 mx-2' : ''}`}
            >
              <CalendarIcon className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
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
          size={isMobile ? "default" : "icon"}
          onClick={handleNextDay}
          className={isMobile ? "px-4 py-2 text-base" : "ml-1"}
        >
          {isMobile && "Next"}
          <ChevronRight className={isMobile ? "h-5 w-5 ml-1" : "h-4 w-4"} />
        </Button>
      </div>
      
      {/* Date Range and Monthly buttons - side by side on mobile */}
      <div className={`${isMobile ? 'flex justify-between w-full' : ''}`}>
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={isRangeMode ? "default" : "outline"}
              className={`flex items-center space-x-2 ${isMobile ? 'text-base flex-1 mr-2' : ''}`}
            >
              <CalendarRange className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
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
                numberOfMonths={1}
                className="touch-manipulation"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  onClick={handleDateRangeSelection}
                  disabled={!dateRange?.from || !dateRange?.to}
                  className={isMobile ? "text-base py-2" : ""}
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
          className={`border-lumenaura-lavender ${isMobile ? 'text-base flex-1' : ''}`}
        >
          Monthly View
        </Button>
      </div>
      
      <Button
        variant="ghost"
        onClick={onLogout}
        className={`${isMobile ? 'w-full text-base py-2 mt-2' : ''}`}
      >
        Logout
      </Button>
    </div>
  );
};

export default DateControls;
