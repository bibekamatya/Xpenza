"use client";

import type { DateInfo, DateRange, ColorVariant } from "@/lib/calendar";
import CalendarHeader from "./calendarHeader";
import CalendarGrid from "./calendarGrid";
import MonthYearPicker from "./monthYearPicker";

interface CalendarContentProps {
  currentYear: number;
  currentMonth: number;
  months: string[];
  days: string[];
  calendarDays: (number | null)[];
  selectedDate: DateInfo | null;
  selectedRange: DateRange;
  focusedDate: number | null;
  dateRangeMode: boolean;
  calendarType: "BS" | "AD";
  showTooltip: boolean;
  showToday: boolean;
  showDropdown: boolean;
  colors: ColorVariant;
  minDate?: string;
  maxDate?: string;
  calendarClassName?: string;
  focusedYearIndex: number;
  focusedMonthIndex: number;
  yearRangeStart: number;
  showQuickSelect?: boolean;
  quickSelectRanges?: Array<{ label: string; value: string }>;
  activeRange?: string;
  onNavigateMonth: (direction: 1 | -1) => void;
  onNavigateYear: (direction: 1 | -1) => void;
  onToggleDropdown: () => void;
  onDateSelect: (day: number) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onYearRangeChange: (direction: number) => void;
  onCloseDropdown: () => void;
  onGoToToday: () => void;
  onQuickSelect?: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isToday: (year: number, month: number, day: number) => boolean;
}

export const CalendarContent = ({
  currentYear,
  currentMonth,
  months,
  days,
  calendarDays,
  selectedDate,
  selectedRange,
  focusedDate,
  dateRangeMode,
  calendarType,
  showTooltip,
  showToday,
  showDropdown,
  colors,
  minDate,
  maxDate,
  calendarClassName,
  focusedYearIndex,
  focusedMonthIndex,
  yearRangeStart,
  showQuickSelect,
  quickSelectRanges,
  activeRange,
  onNavigateMonth,
  onNavigateYear,
  onToggleDropdown,
  onDateSelect,
  onYearChange,
  onMonthChange,
  onYearRangeChange,
  onCloseDropdown,
  onGoToToday,
  onQuickSelect,
  onKeyDown,
  isToday,
}: CalendarContentProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl md:flex-row">
      {showQuickSelect && quickSelectRanges && (
        <div className="w-full border-b border-gray-100 dark:border-gray-800 p-3 md:w-44 md:border-r md:border-b-0">
          <h4 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Quick Select
          </h4>
          <div className="flex gap-2 overflow-x-auto md:flex-col md:space-y-0">
            {quickSelectRanges.map(range => (
              <button
                key={range.value}
                onClick={() => onQuickSelect?.(range.value)}
                className={`flex-shrink-0 rounded-md px-3 py-0.5 text-[11px] whitespace-nowrap transition-colors md:w-full md:text-left ${
                  activeRange === range.value
                    ? "bg-teal-50 dark:bg-teal-950 font-medium text-teal-700 dark:text-teal-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div
        className={calendarClassName || `w-full md:w-80`}
        onKeyDown={onKeyDown}
      >
        <CalendarHeader
          currentYear={currentYear}
          currentMonth={currentMonth}
          months={months}
          colors={colors}
          onNavigateMonth={onNavigateMonth}
          onNavigateYear={onNavigateYear}
          onToggleDropdown={onToggleDropdown}
          showDropdown={showDropdown}
        />

        <CalendarGrid
          days={days}
          calendarDays={calendarDays}
          currentYear={currentYear}
          currentMonth={currentMonth}
          months={months}
          selectedDate={selectedDate}
          selectedRange={selectedRange}
          focusedDate={focusedDate}
          dateRangeMode={dateRangeMode}
          calendarType={calendarType}
          showTooltip={showTooltip}
          showToday={showToday}
          colors={colors}
          onDateSelect={onDateSelect}
          isToday={isToday}
          minDate={minDate}
          maxDate={maxDate}
        />

        {showDropdown && (
          <MonthYearPicker
            currentYear={currentYear}
            currentMonth={currentMonth}
            months={months}
            calendarType={calendarType}
            showToday={showToday}
            colors={colors}
            focusedYearIndex={focusedYearIndex}
            focusedMonthIndex={focusedMonthIndex}
            yearRangeStart={yearRangeStart}
            onYearChange={onYearChange}
            onMonthChange={onMonthChange}
            onYearRangeChange={onYearRangeChange}
            onClose={onCloseDropdown}
            onGoToToday={onGoToToday}
          />
        )}
      </div>
    </div>
  );
};
