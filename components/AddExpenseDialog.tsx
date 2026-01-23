"use client";
import { motion, AnimatePresence } from "framer-motion";
import Form from "./Form";
import { Transaction } from "@/lib/types";
import { X, TrendingUp, TrendingDown, Edit, Plus } from "lucide-react";
import { useBackButton } from "@/hooks/useBackButton";
import { useEffect } from "react";

interface AddExpenseDialogProps {
  editTransaction?: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: Transaction) => void;
}

export default function AddExpenseDialog({
  isOpen,
  onClose,
  editTransaction,
  onSuccess,
}: AddExpenseDialogProps) {
  const isDialogOpen = !!editTransaction || isOpen;
  useBackButton(isDialogOpen, onClose);

  // Hide calendar when dialog closes and prevent accidental reload
  useEffect(() => {
    if (isDialogOpen) {
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
      
      // Prevent accidental page reload
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      // Restore body scroll when dialog closes
      document.body.style.overflow = 'unset';
      const calendars = document.querySelectorAll('[role="dialog"][aria-label="Calendar"]');
      calendars.forEach(cal => {
        const element = cal as HTMLElement;
        element.style.display = 'none';
      });
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDialogOpen]);

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50" style={{ touchAction: 'none' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            style={{ touchAction: 'none' }}
          />

          {/* Desktop - Center Modal */}
          <div className="hidden md:flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
                <h2 className="text-lg font-bold text-white">
                  {editTransaction?._id ? (
                    <>Edit {editTransaction.type === 'income' ? 'Income' : 'Expense'}</>
                  ) : editTransaction?.type ? (
                    <>Add {editTransaction.type === 'income' ? 'Income' : 'Expense'}</>
                  ) : (
                    <>Add Transaction</>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4">
                <Form
                  key={isDialogOpen ? 'open' : 'closed'}
                  onClose={onClose}
                  editTransaction={editTransaction}
                  onSuccess={onSuccess}
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile - Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl border-t border-slate-700 shadow-2xl max-h-[90vh] flex flex-col"
            style={{ touchAction: 'auto' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1" onClick={onClose} style={{ touchAction: 'none' }}>
              <div className="w-10 h-1 bg-slate-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-2" style={{ touchAction: 'none' }}>
              <h2 className="text-lg font-bold text-white">
                {editTransaction?._id ? (
                  <>Edit {editTransaction.type === 'income' ? 'Income' : 'Expense'}</>
                ) : editTransaction?.type ? (
                  <>Add {editTransaction.type === 'income' ? 'Income' : 'Expense'}</>
                ) : (
                  <>Add Transaction</>
                )}
              </h2>
            </div>

            {/* Form */}
            <div className="px-4 pb-4 flex-1 min-h-0 overflow-y-auto">
              <Form
                key={isDialogOpen ? 'open' : 'closed'}
                onClose={onClose}
                editTransaction={editTransaction}
                onSuccess={onSuccess}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
