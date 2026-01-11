"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/lib/types";
import { Edit2, Trash2, Calendar, Tag, TrendingUp, TrendingDown } from "lucide-react";
import { useBackButton } from "@/hooks/useBackButton";
import { getIcon, formatDateWithBS } from "@/lib/helper";

interface TransactionActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionActionsSheet = ({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete,
}: TransactionActionsSheetProps) => {
  useBackButton(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-800 rounded-t-3xl border-t border-slate-700 z-50 md:hidden"
          >
            <div
              className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mt-3 mb-4 cursor-pointer"
              onClick={onClose}
            />

            <div className="px-6 pb-8">
              {/* Transaction Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-600/10 flex items-center justify-center shrink-0 border border-blue-600/20">
                    <span className="text-3xl">{getIcon(transaction.category)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xl truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        transaction.type === "income" ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`text-3xl font-bold mb-4 ${
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }`}>
                  Rs. {transaction.amount.toLocaleString()}
                </div>

                {/* Transaction Details */}
                <div className="space-y-2 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-3 text-sm">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white font-medium ml-auto">{transaction.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white font-medium ml-auto">{formatDateWithBS(transaction.date)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onEdit}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  <Edit2 className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">
                    Edit Transaction
                  </span>
                </button>

                <button
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-600/20 hover:bg-red-600/30 rounded-xl transition-all active:scale-[0.98] border border-red-600/30"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">
                    Delete Transaction
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionActionsSheet;
