import { useEffect } from "react";

export const useBackButton = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      onClose();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isOpen, onClose]);
};
