"use client";
import { X, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "csv" | "pdf", range: string, customStart?: string, customEnd?: string) => void;
}

const ExportSheet = ({ isOpen, onClose, onExport }: ExportSheetProps) => {
  const [selectedRange, setSelectedRange] = useState<"all" | "today" | "week" | "month" | "year" | "custom">("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleExport = (type: "csv" | "pdf") => {
    onExport(type, selectedRange, customStart, customEnd);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto bg-slate-800 rounded-t-3xl md:rounded-xl border-t md:border border-slate-700 w-full md:max-w-md z-50"
          >
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mt-3 mb-4 cursor-pointer md:hidden" onClick={onClose} />
            <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white">Export Transactions</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

        <div className="p-6 space-y-6">
          {/* Date Range Selection */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Select Date Range</p>
            <div className="grid grid-cols-3 gap-2">
              {["all", "today", "week", "month", "year", "custom"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range as any)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    selectedRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs */}
          {selectedRange === "custom" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* Export Type Buttons */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Export As</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95"
              >
                <FileText className="w-5 h-5" />
                CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95"
              >
                <FileText className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
      )}
    </AnimatePresence>
  );
};

export default ExportSheet;
