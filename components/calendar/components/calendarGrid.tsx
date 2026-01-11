"use client";

import type { DateInfo, DateRange, ColorVariant } from "@/lib/calendar";
import {
  isSameDate,
  isDateInRange,
  getADDateString,
  getBSDateFormatted,
} from "../utils/calendarUtils";

interface CalendarGridProps {
  days: string[];
  calendarDays: (number | null)[];
  currentYear: number;
  currentMonth: number;
  months: string[];
  selectedDate: DateInfo | null;
  selectedRange: DateRange;
  focusedDate: number | null;
  dateRangeMode: boolean;
  calendarType: "BS" | "AD";
  showTooltip: boolean;
  showToday: boolean;
  colors: ColorVariant;
  minDate?: string;
  maxDate?: string;
  onDateSelect: (day: number) => void;
  isToday: (year: number, month: number, day: number) => boolean;
}

const CalendarGrid = ({
  days,
  calendarDays,
  currentYear,
  currentMonth,
  months,
  selectedDate,
  selectedRange,
  focusedDate,
  dateRangeMode,
  calendarType,
  showTooltip,
  showToday,
  minDate,
  maxDate,
  colors,
  onDateSelect,
  isToday,
}: CalendarGridProps) => {
  const isDisabled = (day: number) => {
    let adDate: string;

    if (calendarType === "BS") {
      // Convert BS to AD string
      adDate = getADDateString(currentYear, currentMonth, day); // "YYYY-MM-DD"
    } else {
      // Already in AD
      adDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    return (minDate && adDate < minDate) || (maxDate && adDate > maxDate);
  };

  return (
    <div className="p-3">
      {/* Day Headers */}
      <div className="mb-1.5 grid grid-cols-7 gap-0.5">
        {days.map(day => (
          <div
            key={day}
            className="flex h-7 items-center justify-center text-xs font-medium text-gray-600"
            role="columnheader"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date Grid */}
      <div
        className="grid grid-cols-7 gap-0.5"
        role="grid"
        tabIndex={0}
        aria-label="Calendar grid. Use arrow keys to navigate, Enter to select, T for today, PageUp/PageDown for month navigation"
      >
        {calendarDays.map((day, index) => (
          <div key={index} className="flex h-8 items-center justify-center">
            {day ? (
              <button
                type="button"
                disabled={isDisabled(day) ? true : false}
                onClick={() => !isDisabled(day) && onDateSelect(day)}
                title={
                  showTooltip
                    ? calendarType === "BS"
                      ? getADDateString(currentYear, currentMonth, day)
                      : getBSDateFormatted(currentYear, currentMonth, day)
                    : undefined
                }
                className={`relative flex h-6 w-6 items-center justify-center rounded-lg text-xs transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  dateRangeMode
                    ? // Range mode styling
                      (selectedRange.start &&
                        isSameDate(
                          { year: currentYear, month: currentMonth, day },
                          selectedRange.start
                        )) ||
                      (selectedRange.end &&
                        isSameDate(
                          { year: currentYear, month: currentMonth, day },
                          selectedRange.end
                        ))
                      ? `${colors.selected} ${colors.selectedHover} scale-105 transform font-bold`
                      : selectedRange.start &&
                          selectedRange.end &&
                          isDateInRange(
                            { year: currentYear, month: currentMonth, day },
                            selectedRange.start,
                            selectedRange.end
                          )
                        ? `${colors.range} ${colors.rangeHover} font-medium`
                        : focusedDate === day
                          ? `ring-2 ring-offset-1 ${colors.focus.replace("focus:", "")} bg-gray-100`
                          : isToday(currentYear, currentMonth, day)
                            ? `border border-gray-300 bg-gray-100 font-bold ${colors.primary}`
                            : `font-medium text-gray-700 hover:scale-105 hover:bg-gray-100 ${colors.primary.replace("hover:", "focus:")}`
                    : // Single date mode styling
                      selectedDate?.day === day &&
                        selectedDate?.month === currentMonth &&
                        selectedDate?.year === currentYear
                      ? `${colors.selected} ${colors.selectedHover} scale-105 transform font-bold`
                      : focusedDate === day
                        ? `shadow-xl ring-2 ring-offset-1 ${colors.focus.replace("focus:", "")} bg-gray-100`
                        : isToday(currentYear, currentMonth, day)
                          ? `border border-gray-300 bg-gray-100 font-bold ${colors.primary}`
                          : `font-medium text-teal-700 hover:bg-teal-100 ${colors.primary.replace("hover:", "focus:")}`
                }`}
                role="gridcell"
                aria-label={`${day} ${months[currentMonth]} ${currentYear}`}
                tabIndex={-1}
              >
                {day}
              </button>
            ) : (
              <div className="h-7 w-7" role="gridcell" />
            )}
          </div>
        ))}
      </div>

      {/* Range mode indicator */}
      {/* {dateRangeMode && (
        <div className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500">
          <div className="text-center">
            {!selectedRange.start
              ? "Select start date"
              : !selectedRange.end
                ? "Select end date"
                : "Range selected"}
          </div>
        </div>
      )} */}

      {/* Keyboard shortcuts help */}
      {/* <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
        <div className="text-center">
          Use arrow keys to navigate • Enter to select • T for today • Esc to
          close
        </div>
      </div> */}
    </div>
  );
};

export default CalendarGrid;
