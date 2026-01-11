"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarPortalProps {
  isOpen: boolean;
  children: ReactNode;
  position: React.CSSProperties;
  showBackdrop: boolean;
  onBackdropClick: () => void;
}

export const CalendarPortal = ({
  isOpen,
  children,
  position,
  showBackdrop,
  onBackdropClick,
}: CalendarPortalProps) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") return null;

  // Mobile bottom sheet
  if (showBackdrop && isMobile) {
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
              onClick={onBackdropClick}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 rounded-t-3xl border-t border-gray-200 dark:border-gray-800 z-[9999] max-h-[85vh] overflow-hidden"
            >
              <div
                className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 mb-4 cursor-pointer"
                onClick={onBackdropClick}
              />
              <div className="px-4 pb-4 overflow-y-auto max-h-[calc(85vh-2rem)]">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  // Desktop dropdown
  if (!isOpen) return null;
  
  return createPortal(
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          style={{ zIndex: 9998 }}
          onClick={onBackdropClick}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Calendar"
        className="fixed"
        style={position}
      >
        {children}
      </div>
    </>,
    document.body
  );
};
