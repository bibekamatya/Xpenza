"use client";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "csv" | "pdf") => void;
}

const ExportSheet = ({ isOpen, onClose, onExport }: ExportSheetProps) => {
  const handleExport = (type: "csv" | "pdf") => {
    onExport(type);
    onClose();
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto bg-slate-800 rounded-t-3xl md:rounded-xl border-t md:border border-slate-700 w-full md:max-w-md z-50"
          >
            <div
              className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mt-3 mb-4 cursor-pointer md:hidden"
              onClick={onClose}
            />
            <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white">
                Export Transactions
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-400 mb-4 text-center">
                Export currently filtered transactions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleExport("csv")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95"
                >
                  <FileText className="w-5 h-5" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95"
                >
                  <FileText className="w-5 h-5" />
                  PDF
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExportSheet;
