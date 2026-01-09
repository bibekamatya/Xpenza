"use client";
import { X } from "lucide-react";
import { Transaction } from "@/lib/types";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const AnalyticsModal = ({
  isOpen,
  onClose,
  transactions,
}: AnalyticsModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const categoryTotals = transactions.reduce(
    (acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalExpense = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0,
  );
  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

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
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-800 md:rounded-xl border-t md:border border-slate-700 w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-t-xl"
            >
              <div
                className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 md:p-6"
                onClick={onClose}
              >
                <div className="md:hidden w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-3 cursor-pointer"></div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Analytics</h2>
                  <button
                    onClick={onClose}
                    className="hidden md:block p-2 hover:bg-slate-700 rounded-lg transition-all active:scale-90"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 rounded-lg p-4 border border-green-600/30">
                    <p className="text-green-400 text-xs font-medium mb-1">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ₹{totalIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 rounded-lg p-4 border border-red-600/30">
                    <p className="text-red-400 text-xs font-medium mb-1">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ₹{totalExpense.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Spending by Category
                  </h3>
                  <div className="space-y-3">
                    {sortedCategories.map(([category, amount]) => {
                      const percentage = (amount / totalExpense) * 100;
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-300">
                              {category}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              ₹{amount.toLocaleString()} (
                              {percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transaction Count */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Total Transactions
                    </span>
                    <span className="text-white font-semibold">
                      {transactions.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsModal;
