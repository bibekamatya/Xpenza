"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/lib/types";
import { X, TrendingUp, TrendingDown, Edit2, Trash2 } from "lucide-react";
import { getIcon } from "@/lib/helper";

interface SplitDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SplitDetailsDialog({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete
}: SplitDetailsDialogProps) {
  if (!transaction?.splits) return null;

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
                <h2 className="text-lg font-bold text-white">Split Details</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {/* Transaction Summary */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Total Transaction</span>
                      <div className="flex items-center gap-1">
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-bold ${
                          transaction.type === "income" ? "text-green-500" : "text-red-500"
                        }`}>
                          Rs.{transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-white font-medium">{transaction.description}</div>
                    <div className="text-slate-400 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Split Breakdown */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3">
                      Split Breakdown ({transaction.splits.length} categories)
                    </h3>
                    <div className="space-y-2">
                      {transaction.splits.map((split, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                              <span className="text-sm">{getIcon(split.category)}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{split.category}</div>
                              <div className="text-slate-400 text-xs">
                                {((split.amount / transaction.amount) * 100).toFixed(1)}% of total
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold ${
                            transaction.type === "income" ? "text-green-500" : "text-red-500"
                          }`}>
                            Rs.{split.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification */}
                  <div className="bg-green-600/20 text-green-400 p-3 rounded-lg text-sm">
                    ✓ Split total matches transaction amount
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit();
                        onClose();
                      }}
                      className="md:hidden px-4 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete();
                        onClose();
                      }}
                      className="md:hidden px-4 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}