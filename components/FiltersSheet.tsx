"use client";
import { useState } from "react";
import BaseBottomSheet from "./BaseBottomSheet";

interface FiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    type: string;
    dateRange: string;
    category: string;
    search: string;
    startDate: string;
    endDate: string;
  }) => void;
  currentFilters: {
    type: string;
    dateRange: string;
    category: string;
    search: string;
    startDate: string;
    endDate: string;
  };
}

const FiltersSheet = ({ isOpen, onClose, onApplyFilters, currentFilters }: FiltersSheetProps) => {
  const [type, setType] = useState(currentFilters.type);
  const [dateRange, setDateRange] = useState(currentFilters.dateRange);
  const [category, setCategory] = useState(currentFilters.category);
  const [startDate, setStartDate] = useState(currentFilters.startDate);
  const [endDate, setEndDate] = useState(currentFilters.endDate);

  const handleApply = () => {
    onApplyFilters({ ...currentFilters, type, dateRange, category, startDate, endDate });
    onClose();
  };

  const handleClear = () => {
    setType("all");
    setDateRange("all");
    setCategory("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <BaseBottomSheet isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Type</label>
          <div className="flex gap-2">
            {["all", "income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                  type === t
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-2 block">Date Range</label>
          <div className="grid grid-cols-3 gap-2">
            {["all", "today", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  dateRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white appearance-none"
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Investment">Investment</option>
          <option value="Gift">Gift</option>
          <option value="Other">Other</option>
        </select>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Custom Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg active:scale-[0.98] transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg active:scale-[0.98] transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </BaseBottomSheet>
  );
};

export default FiltersSheet;
