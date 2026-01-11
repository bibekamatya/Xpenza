"use client";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import type { ColorVariant } from "@/lib/calendar";

interface CalendarHeaderProps {
  currentYear: number;
  currentMonth: number;
  months: string[];
  colors: ColorVariant;
  onNavigateMonth: (direction: 1 | -1) => void;
  onNavigateYear: (direction: 1 | -1) => void;
  onToggleDropdown: () => void;
  showDropdown: boolean;
}

const CalendarHeader = ({
  currentYear,
  currentMonth,
  months,
  colors,
  onNavigateMonth,
  onNavigateYear,
  onToggleDropdown,
  showDropdown,
}: CalendarHeaderProps) => {
  return (
    <div className="sticky top-0 flex items-center justify-between rounded-t-lg border-b border-gray-50 bg-white px-3 py-2.5">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onNavigateYear(-1)}
          className={`rounded-md p-1.5 transition-colors ${colors.primary}`}
          title="Previous Year (Shift+PageUp)"
          aria-label="Previous Year"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateMonth(-1)}
          className={`rounded-md p-1.5 transition-colors ${colors.primary}`}
          title="Previous Month (PageUp)"
          aria-label="Previous Month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleDropdown();
          }}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          {months[currentMonth]} {currentYear}
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onNavigateMonth(1)}
          className={`rounded-md p-1.5 transition-colors ${colors.primary}`}
          title="Next Month (PageDown)"
          aria-label="Next Month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateYear(1)}
          className={`rounded-md p-1.5 transition-colors ${colors.primary}`}
          title="Next Year (Shift+PageDown)"
          aria-label="Next Year"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
