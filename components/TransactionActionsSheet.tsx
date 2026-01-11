"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/lib/types";
import { Edit2, Trash2 } from "lucide-react";
import { useBackButton } from "@/hooks/useBackButton";

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
              <div className="mb-6">
                <p className="text-slate-400 text-sm">Transaction</p>
                <p className="text-white font-semibold text-lg mt-1">
                  {transaction.description}
                </p>
                <p className="text-2xl font-bold text-red-500 mt-2">
                  ${transaction.amount}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onEdit}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all active:scale-[0.98]"
                >
                  <Edit2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">
                    Edit Transaction
                  </span>
                </button>

                <button
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-600/20 hover:bg-red-600/30 rounded-xl transition-all active:scale-[0.98]"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">
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
