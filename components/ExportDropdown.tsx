"use client";
import { useState, useRef, useEffect } from "react";
import { Download, FileText } from "lucide-react";

interface ExportDropdownProps {
  onExportCSV: (range: string, startDate?: string, endDate?: string) => void;
  onExportPDF: (range: string, startDate?: string, endDate?: string) => void;
  defaultRange?: "all" | "today" | "week" | "month" | "year";
}

export const ExportDropdown = ({ onExportCSV, onExportPDF, defaultRange = "all" }: ExportDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exportRange, setExportRange] = useState<"all" | "today" | "week" | "month" | "year">(defaultRange);
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExportRange(defaultRange);
  }, [defaultRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg transition-all active:scale-95 text-sm"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-10">
          <div className="p-4 border-b border-slate-700">
            <p className="text-sm font-semibold text-white mb-3">Select Range</p>
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
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onExportCSV(showCustomDates ? "custom" : exportRange, customStartDate, customEndDate);
              setShowMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
          >
            <FileText className="w-4 h-4" />
            Export as CSV
          </button>
          <button
            onClick={() => {
              onExportPDF(showCustomDates ? "custom" : exportRange, customStartDate, customEndDate);
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
