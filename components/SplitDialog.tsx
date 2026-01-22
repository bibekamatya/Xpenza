"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionSplit } from "@/lib/types";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface SplitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (splits: TransactionSplit[]) => void;
  totalAmount: number;
  transactionType: "income" | "expense";
  initialSplits?: TransactionSplit[];
}

export default function SplitDialog({
  isOpen,
  onClose,
  onSave,
  totalAmount,
  transactionType,
  initialSplits = [{ category: "", amount: 0 }]
}: SplitDialogProps) {
  const [splits, setSplits] = useState<TransactionSplit[]>(initialSplits);

  const categories = {
    expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
    income: ["Salary", "Freelance", "Investment", "Other"],
  };

  const totalSplit = splits.reduce((sum, s) => sum + (s.amount || 0), 0);
  const isValid = Math.abs(totalSplit - totalAmount) < 0.01 && splits.every(s => s.category && s.amount > 0);

  const handleSave = () => {
    if (isValid) {
      onSave(splits.filter(s => s.category && s.amount > 0));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
                <h2 className="text-lg font-bold text-white">Split Transaction</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">
                    Total Amount: <span className="font-bold text-white">Rs.{totalAmount}</span>
                  </div>

                  {splits.map((split, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={split.category}
                        onChange={(e) => {
                          const newSplits = [...splits];
                          newSplits[index].category = e.target.value;
                          setSplits(newSplits);
                        }}
                        className="flex-1 h-10 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories[transactionType].map((cat: string) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={split.amount || ""}
                        onChange={(e) => {
                          const newSplits = [...splits];
                          newSplits[index].amount = parseFloat(e.target.value) || 0;
                          setSplits(newSplits);
                        }}
                        placeholder="Amount"
                        className="w-24 h-10 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {splits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSplits(splits.filter((_, i) => i !== index))}
                          className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSplits([...splits, { category: "", amount: 0 }])}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Split
                  </button>

                  <div className={`text-sm p-3 rounded-lg ${
                    isValid ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                  }`}>
                    Split Total: Rs.{totalSplit} / Rs.{totalAmount}
                    {!isValid && <div className="text-xs mt-1">Total must equal transaction amount</div>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button
                  onClick={onClose}
                  className="flex-1 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isValid}
                  className={`flex-1 h-10 rounded-lg transition-all text-sm ${
                    isValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-600 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Save Splits
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}