"use client";
import { useState, useRef, useEffect } from "react";
import { Filter, X } from "lucide-react";

interface FiltersProps {
  onApplyFilters: (filters: {
    type: string;
    dateRange: string;
    category: string;
    search: string;
    startDate: string;
    endDate: string;
  }) => void;
}

const Filters = ({ onApplyFilters }: FiltersProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      onApplyFilters({
        type,
        dateRange,
        category,
        search: value,
        startDate,
        endDate,
      });
    }, 500);
  };

  const handleApply = () => {
    onApplyFilters({ type, dateRange, category, search, startDate, endDate });
    setShowDropdown(false);
  };

  const handleClear = () => {
    setType("all");
    setDateRange("all");
    setCategory("all");
    setSearch("");
    setStartDate("");
    setEndDate("");
    onApplyFilters({
      type: "all",
      dateRange: "all",
      category: "all",
      search: "",
      startDate: "",
      endDate: "",
    });
  };

  const activeFiltersCount = [
    type !== "all",
    dateRange !== "all",
    category !== "all",
    search,
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <div className="hidden md:block px-8 pb-6">
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-80 h-[42px] px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {["all", "income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  onApplyFilters({
                    type: t,
                    dateRange,
                    category,
                    search,
                    startDate,
                    endDate,
                  });
                }}
                className={`px-4 h-[42px] text-sm rounded-lg transition-all font-medium whitespace-nowrap ${
                  type === t
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                    : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              onApplyFilters({
                type,
                dateRange,
                category: e.target.value,
                search,
                startDate,
                endDate,
              });
            }}
            className="w-48 h-[42px] px-4 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm appearance-none"
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative px-4 h-[42px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              More
              {(dateRange !== "all" || startDate || endDate) && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {
                    [dateRange !== "all", startDate, endDate].filter(Boolean)
                      .length
                  }
                </span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-white">
                    Date Filters
                  </h3>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">
                    Date Range
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["all", "today", "week", "month", "year"].map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
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
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">
                    Custom Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-[42px] px-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-[42px] px-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setDateRange("all");
                      setStartDate("");
                      setEndDate("");
                      onApplyFilters({
                        type,
                        dateRange: "all",
                        category,
                        search,
                        startDate: "",
                        endDate: "",
                      });
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-all active:scale-95 font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all active:scale-95 font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {type !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <button
                onClick={() => {
                  setType("all");
                  onApplyFilters({
                    type: "all",
                    dateRange,
                    category,
                    search,
                    startDate,
                    endDate,
                  });
                }}
                className="hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
              {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
              <button
                onClick={() => {
                  setDateRange("all");
                  onApplyFilters({
                    type,
                    dateRange: "all",
                    category,
                    search,
                    startDate,
                    endDate,
                  });
                }}
                className="hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {category !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
              {category}
              <button
                onClick={() => {
                  setCategory("all");
                  onApplyFilters({
                    type,
                    dateRange,
                    category: "all",
                    search,
                    startDate,
                    endDate,
                  });
                }}
                className="hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(startDate || endDate) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
              {startDate || "Start"} → {endDate || "End"}
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  onApplyFilters({
                    type,
                    dateRange,
                    category,
                    search,
                    startDate: "",
                    endDate: "",
                  });
                }}
                className="hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-white text-xs transition-colors font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
