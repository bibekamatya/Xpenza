"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface BaseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const BaseBottomSheet = ({ isOpen, onClose, title, children }: BaseBottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed bottom-0 left-0 right-0 bg-slate-800 rounded-t-3xl border-t border-slate-700 z-50 md:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-800 pt-4 px-6 pb-2 border-b border-slate-700">
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-slate-400 active:scale-90 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BaseBottomSheet;
