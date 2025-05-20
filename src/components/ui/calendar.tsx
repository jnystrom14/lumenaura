
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isMobile = useIsMobile();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 pointer-events-auto print:w-full print:p-0",
        isMobile ? "touch-manipulation w-full" : "",
        className
      )}
      classNames={{
        months: cn(
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 print:flex-row print:space-y-0 print:space-x-4 print:w-full",
          isMobile && "w-full"
        ),
        month: cn(
          "space-y-4 print:w-full",
          isMobile && "w-full"
        ),
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: cn("text-sm font-medium", isMobile && "text-xs", "print:text-sm"),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 print:h-8 print:w-8",
          isMobile && "touch-manipulation h-6 w-6"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 print:w-full",
        head_row: "flex print:w-full",
        head_cell: cn(
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] print:w-full print:text-[0.9rem]",
          isMobile && "w-8 text-[0.7rem]"
        ),
        row: "flex w-full mt-2 print:w-full",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 print:h-10 print:w-full",
          isMobile && "touch-manipulation h-8 w-8 text-xs"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 print:h-10 print:w-full",
          isMobile && "touch-manipulation h-8 w-8"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className={cn("h-4 w-4", isMobile && "h-3 w-3", "print:h-4 print:w-4")} />,
        IconRight: ({ ..._props }) => <ChevronRight className={cn("h-4 w-4", isMobile && "h-3 w-3", "print:h-4 print:w-4")} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
