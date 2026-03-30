import { useState, useRef } from "react";
import { Download, FileText } from "lucide-react";
import { Calendar, DatePicker, PRESET_KEYS } from "bs-ad-calendar-react";
import type { DateRangeOutput, DateOutput } from "bs-ad-calendar-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface ExportDropdownProps {
  onExportCSV: (range: string, startDate?: string, endDate?: string) => void;
  onExportPDF: (range: string, startDate?: string, endDate?: string) => void;
  defaultRange?: "all" | "today" | "week" | "month" | "year";
  iconOnly?: boolean;
}

export const ExportDropdown = ({
  onExportCSV,
  onExportPDF,
  defaultRange = "all",
  iconOnly = false,
}: ExportDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exportRange, setExportRange] = useState<
    "all" | "today" | "week" | "month" | "year"
  >(defaultRange);
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setShowMenu(false), showMenu);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg transition-all active:scale-95 text-sm"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-10">
          <div className="p-4 border-b border-slate-700">
            <p className="text-sm font-semibold text-white mb-3">
              Select Range
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["all", "today", "week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setExportRange(range as any);
                    setShowCustomDates(false);
                  }}
                  className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                    exportRange === range && !showCustomDates
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setShowCustomDates(!showCustomDates)}
                className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                  showCustomDates
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Custom
              </button>
            </div>
            {showCustomDates && (
              <div className="mt-3 space-y-2">
                <DatePicker
                  calendarType="BS"
                  placeholder="Start date"
                  inputClassName="w-full h-[38px] px-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
                  onDateSelect={(date: DateOutput) => setCustomStartDate(date.ad)}
                />
                <DatePicker
                  calendarType="BS"
                  placeholder="End date"
                  inputClassName="w-full h-[38px] px-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
                  onDateSelect={(date: DateOutput) => setCustomEndDate(date.ad)}
                />
                <Calendar
                  calendarType="BS"
                  mode="range"
                  showRangePresets
                  rangePresetsPosition="top"
                  presetKeys={[
                    PRESET_KEYS.THIS_MONTH,
                    PRESET_KEYS.LAST_MONTH,
                    PRESET_KEYS.LAST_7_DAYS,
                    PRESET_KEYS.LAST_30_DAYS,
                    PRESET_KEYS.LAST_3_MONTHS,
                    PRESET_KEYS.LAST_6_MONTHS,
                    PRESET_KEYS.LAST_YEAR,
                  ]}
                  onRangeSelect={(range: DateRangeOutput) => {
                    setCustomStartDate(range.start.ad)
                    setCustomEndDate(range.end.ad)
                  }}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onExportCSV(
                showCustomDates ? "custom" : exportRange,
                customStartDate,
                customEndDate,
              );
              setShowMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
          >
            <FileText className="w-4 h-4" />
            Export as CSV
          </button>
          <button
            onClick={() => {
              onExportPDF(
                showCustomDates ? "custom" : exportRange,
                customStartDate,
                customEndDate,
              );
              setShowMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
          >
            <FileText className="w-4 h-4" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};
