"use client";
import { motion, AnimatePresence } from "framer-motion";
import Form from "./Form";
import { Transaction } from "@/lib/types";
import { X } from "lucide-react";
import { useBackButton } from "@/hooks/useBackButton";
import { useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";

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
  const { t } = useLocale();
  useBackButton(isDialogOpen, onClose);

  // Hide calendar when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      const calendars = document.querySelectorAll('[role="dialog"][aria-label="Calendar"]');
      calendars.forEach(cal => {
        const element = cal as HTMLElement;
        element.style.display = 'none';
      });
    }
  }, [isDialogOpen]);

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Desktop - Center Modal */}
          <div className="hidden md:flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">
                  {t("addTransaction")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <Form
                key={isDialogOpen ? 'open' : 'closed'}
                onClose={onClose}
                editTransaction={editTransaction}
                onSuccess={onSuccess}
              />
            </motion.div>
          </div>

          {/* Mobile - Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl border-t border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-white">{t("addTransaction")}</h2>
            </div>

            {/* Form */}
            <Form
              key={isDialogOpen ? 'open' : 'closed'}
              onClose={onClose}
              editTransaction={editTransaction}
              onSuccess={onSuccess}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
