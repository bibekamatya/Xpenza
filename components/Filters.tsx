import React from "react";

const Filters = () => {
  return (
    <div className="hidden md:block px-8 pb-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-slate-400 text-sm self-center mr-2">
            Quick:
          </span>
          <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg transition-all active:scale-95">
            Today
          </button>
          <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg transition-all active:scale-95">
            Week
          </button>
          <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg transition-all active:scale-95">
            Month
          </button>
          <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg transition-all active:scale-95">
            Year
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option>All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Income</option>
          </select>
          <input
            type="date"
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <span className="text-slate-500 self-center">to</span>
          <input
            type="date"
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95 text-sm">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
