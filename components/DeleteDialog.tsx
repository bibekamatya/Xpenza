"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionName: string;
}

const DeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  transactionName,
}: DeleteDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await onConfirm();
      onClose();
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Delete Transaction
                    </h3>
                    <p className="text-sm text-slate-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {transactionName}
                  </span>
                  ?
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isPending
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-700 active:scale-[0.98]"
                    }`}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                    {isPending && (
                      <div
                        className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-white rounded-full"
                        role="status"
                        aria-label="loading"
                      ></div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
