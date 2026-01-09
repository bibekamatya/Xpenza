import React from "react";
import { X } from "lucide-react";

const BottomSheet = ({ showFilters, setShowFilters }: any) => {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
        showFilters
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowFilters(false)}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl space-y-4 max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-out ${
          showFilters ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 bg-slate-800 pt-4 px-6 pb-2 border-b border-slate-700">
          <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowFilters(false)} />
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-slate-400 active:scale-90 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-3 px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg active:scale-95 transition-all">
              Today
            </button>
            <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg active:scale-95 transition-all">
              This Week
            </button>
            <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg active:scale-95 transition-all">
              This Month
            </button>
            <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg active:scale-95 transition-all">
              Year
            </button>
          </div>

          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500"
          />

          <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
            <option>All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Income</option>
          </select>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">From Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">To Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg active:scale-[0.98] transition-all">
              Clear
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg active:scale-[0.98] transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
