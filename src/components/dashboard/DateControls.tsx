
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
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Logout button clicked");
    onLogout();
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Date Navigation Controls */}
        <div className="flex items-center justify-between bg-white/50 rounded-lg p-2 shadow-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Prev
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={!isRangeMode ? "default" : "outline"}
                className="flex-1 mx-2 text-sm"
              >
                <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {!isRangeMode ? format(selectedDate, "MMM d, yyyy") : "Select date"}
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
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="flex-shrink-0"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
        
        {/* View Options */}
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={isRangeMode ? "default" : "outline"}
                className="flex items-center justify-center text-sm h-10"
              >
                <CalendarRange className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {isRangeMode && dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, "M/d")} - ${format(dateRange.to, "M/d")}`
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
                    setIsRangeMode(true);
                  }}
                  numberOfMonths={1}
                  className="touch-manipulation"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    onClick={handleDateRangeSelection}
                    disabled={!dateRange?.from || !dateRange?.to}
                    className="text-sm"
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
            className="border-lumenaura-lavender text-sm h-10"
          >
            Monthly View
          </Button>
        </div>
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    );
  }
  
  // Desktop layout
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
                initialFocus
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
              initialFocus
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
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default DateControls;
