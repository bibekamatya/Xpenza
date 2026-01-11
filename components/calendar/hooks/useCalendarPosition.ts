import { useState, useEffect } from "react";

interface PositionConfig {
  referenceElement?: HTMLElement | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen?: boolean;
}

export const useCalendarPosition = ({
  referenceElement,
  inputRef,
  isOpen,
}: PositionConfig) => {
  const [position, setPosition] = useState<React.CSSProperties>({
    top: 0,
    left: 0,
    zIndex: 9999,
    opacity: 0,
    transition: 'opacity 0.15s ease-in',
  });

  useEffect(() => {
    if (!isOpen) {
      setPosition((prev) => ({ ...prev, opacity: 0, transition: 'none' }));
      return;
    }

    const calculatePosition = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const isForm = !referenceElement;

      // Mobile form: centered
      if (isMobile && isForm) {
        setPosition({
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          opacity: 1,
          transition: 'opacity 0.15s ease-in',
        });
        return;
      }

      // Desktop or filter: dropdown
      const element = referenceElement || inputRef.current;
      if (!element) {
        setPosition({ top: 0, left: 0, zIndex: 9999, opacity: 0, transition: 'none' });
        return;
      }

      const rect = element.getBoundingClientRect();
      const calendarHeight = 400; // Approximate calendar height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldFlipUp = spaceBelow < calendarHeight && spaceAbove > spaceBelow;

      setPosition({
        ...(shouldFlipUp
          ? { bottom: `${window.innerHeight - rect.top + 8}px` }
          : { top: `${rect.bottom + 8}px` }),
        ...(referenceElement
          ? { right: `${window.innerWidth - rect.right}px` }
          : { left: `${rect.left}px` }),
        transform: "none",
        zIndex: 9999,
        opacity: 1,
        transition: 'opacity 0.15s ease-in',
      });
    };

    // Small delay to ensure DOM is ready
    requestAnimationFrame(calculatePosition);
  }, [referenceElement, inputRef, isOpen]);

  return position;
};
