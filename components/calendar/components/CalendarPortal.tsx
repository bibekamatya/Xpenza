"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof window === "undefined") return null;

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
