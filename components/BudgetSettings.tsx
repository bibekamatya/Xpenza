"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, AlertTriangle } from "lucide-react";
import { getBudget, setBudget } from "@/app/actions/budgetActions";
import toast from "react-hot-toast";

interface BudgetSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const BudgetSettings = ({ isOpen, onClose }: BudgetSettingsProps) => {
  const [totalBudget, setTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);

  const totalCategoryBudget = Object.values(categoryBudgets).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0,
  );
  const remaining = parseFloat(totalBudget) - totalCategoryBudget;
  const isOverBudget = totalCategoryBudget > parseFloat(totalBudget);

  useEffect(() => {
    if (isOpen) {
      loadBudget();
    }
  }, [isOpen]);

  const loadBudget = async () => {
    const result = await getBudget();
    if (result.success && result.budget) {
      setTotalBudget(result.budget.totalBudget?.toString() || "");
      const cats: Record<string, string> = {};
      Object.entries(result.budget.categoryBudgets || {}).forEach(
        ([key, value]) => {
          cats[key] = (value as number).toString();
        },
      );
      setCategoryBudgets(cats);
    }
  };

  const handleSave = async () => {
    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    if (isOverBudget) {
      toast.error("Category budgets exceed total budget");
      return;
    }

    setLoading(true);
    const cats: Record<string, number> = {};
    Object.entries(categoryBudgets).forEach(([key, value]) => {
      if (value && parseFloat(value) > 0) {
        cats[key] = parseFloat(value);
      }
    });

    const result = await setBudget(parseFloat(totalBudget), cats);
    setLoading(false);

    if (result.success) {
      toast.success("Budget saved successfully");
      onClose();
    } else {
      toast.error(result.message || "Failed to save budget");
    }
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 rounded-xl border border-slate-700 z-50"
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">
                  Budget Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  Set your monthly budget to track spending. You'll get alerts
                  when you exceed limits.
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Total Monthly Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="Enter total budget"
                  className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">
                  Category Budgets (Optional)
                </label>
                {totalBudget && parseFloat(totalBudget) > 0 && (
                  <div
                    className={`mb-3 p-3 rounded-lg border ${
                      isOverBudget
                        ? "bg-red-600/10 border-red-600/30"
                        : remaining < parseFloat(totalBudget) * 0.2
                          ? "bg-yellow-600/10 border-yellow-600/30"
                          : "bg-blue-600/10 border-blue-600/30"
                    }`}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span
                        className={
                          isOverBudget ? "text-red-400" : "text-slate-300"
                        }
                      >
                        Allocated: Rs.{totalCategoryBudget.toLocaleString()}
                      </span>
                      <span
                        className={`font-semibold ${
                          isOverBudget
                            ? "text-red-400"
                            : remaining < parseFloat(totalBudget) * 0.2
                              ? "text-yellow-400"
                              : "text-blue-400"
                        }`}
                      >
                        Remaining: Rs.{remaining.toLocaleString()}
                      </span>
                    </div>
                    {isOverBudget && (
                      <p className="text-xs text-red-400 mt-1">
                        Category budgets exceed total budget!
                      </p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div key={cat}>
                      <label className="text-xs text-slate-400 mb-1 block">
                        {cat}
                      </label>
                      <input
                        type="number"
                        value={categoryBudgets[cat] || ""}
                        onChange={(e) =>
                          setCategoryBudgets({
                            ...categoryBudgets,
                            [cat]: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="w-full h-[42px] px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BudgetSettings;
