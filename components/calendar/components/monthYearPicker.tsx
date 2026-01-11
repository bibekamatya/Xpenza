"use client";

import {
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import type { ColorVariant } from "@/lib/calendar";
import { getTodayDate } from "../utils/calendarUtils";

interface MonthYearPickerProps {
  currentYear: number;
  currentMonth: number;
  months: string[];
  calendarType: "BS" | "AD";
  showToday: boolean;
  colors: ColorVariant;
  focusedYearIndex: number;
  focusedMonthIndex: number;
  yearRangeStart: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onYearRangeChange: (direction: number) => void;
  onClose: () => void;
  onGoToToday: () => void;
}

const MonthYearPicker = ({
  currentYear,
  currentMonth,
  months,
  calendarType,
  showToday,
  colors,
  focusedYearIndex,
  focusedMonthIndex,
  yearRangeStart,
  onYearChange,
  onMonthChange,
  onYearRangeChange,
  onClose,
  onGoToToday,
}: MonthYearPickerProps) => {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={e => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-80 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Select Month & Year
          </h3>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-md p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-600 dark:hover:text-gray-400"
            aria-label="Close month year picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          {/* Year Selection */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onYearRangeChange(-10);
                  }}
                  className={`rounded-md p-1 text-xs transition-colors ${colors.primary}`}
                  title="Previous 10 years"
                >
                  <ChevronsLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onYearRangeChange(-1);
                  }}
                  className={`rounded-md p-1 text-xs transition-colors ${colors.primary}`}
                  title="Previous year"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <span className="min-w-[60px] text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                  {yearRangeStart} - {yearRangeStart + 11}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onYearRangeChange(1);
                  }}
                  className={`rounded-md p-1 text-xs transition-colors ${colors.primary}`}
                  title="Next year"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onYearRangeChange(10);
                  }}
                  className={`rounded-md p-1 text-xs transition-colors ${colors.primary}`}
                  title="Next 10 years"
                >
                  <ChevronsRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Year Grid - Fixed range that only changes with arrow navigation */}
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => {
                const year = yearRangeStart + i;
                const isCurrentYear = year === currentYear;
                const isFocused =
                  i === focusedYearIndex && year === currentYear; // Only focus if it's actually the current year
                const isTodayYear =
                  calendarType === "BS"
                    ? year === getTodayDate("BS").year
                    : year === getTodayDate("AD").year;

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onYearChange(year);
                      // Don't close on year selection - let user continue selecting
                    }}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      isCurrentYear
                        ? colors.selected
                        : isFocused
                          ? `ring-2 ring-offset-1 ${colors.focus.replace("focus:", "")}`
                          : isTodayYear && showToday
                            ? `border border-current ${colors.primary}`
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Month
            </label>
            <div className="grid grid-cols-3 gap-1">
              {months.map((month, index) => {
                const isCurrentMonth = index === currentMonth;
                const isFocused = index === focusedMonthIndex;
                const today = getTodayDate(calendarType);
                const isTodayMonth =
                  index === today.month && currentYear === today.year;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onMonthChange(index);
                      onClose();
                    }}
                    className={`rounded-md px-2 py-2 text-xs font-medium transition-colors ${
                      isCurrentMonth
                        ? colors.selected
                        : isFocused
                          ? `ring-2 ring-offset-1 ${colors.focus.replace("focus:", "")}`
                          : isTodayMonth && showToday
                            ? `border border-current ${colors.primary}`
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onGoToToday();
                onClose();
              }}
              className={`flex-1 rounded-md border border-current px-3 py-2 text-xs font-medium transition-colors ${colors.primary}`}
            >
              Go to Today
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onClose();
              }}
              className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthYearPicker;
