"use client";

import { useState, useCallback, useEffect } from "react";

export interface UseUnsavedWarningReturn<T = string> {
  isOpen: boolean;
  requestAction: (nextAction: T, callback: (target: T) => void) => void;
  confirmAction: () => void;
  cancelAction: () => void;
}

/**
 * Hook to guard against leaving a view or tab when there are unsaved form changes.
 * Automatically handles window 'beforeunload' as well as in-app navigation/tab switching.
 */
export function useUnsavedWarning<T = string>(
  isDirty: boolean,
  setIsDirty?: (val: boolean) => void
): UseUnsavedWarningReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<T | null>(null);
  const [onProceedCallback, setOnProceedCallback] = useState<((target: T) => void) | null>(null);

  // Prevent browser tab/window close when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  /**
   * Request a tab switch or action. If dirty, shows confirmation dialog; otherwise proceeds immediately.
   */
  const requestAction = useCallback(
    (nextAction: T, callback: (target: T) => void) => {
      if (!isDirty) {
        callback(nextAction);
        return;
      }

      setPendingTarget(nextAction);
      setOnProceedCallback(() => callback);
      setIsOpen(true);
    },
    [isDirty]
  );

  const confirmAction = useCallback(() => {
    if (pendingTarget !== null && onProceedCallback) {
      onProceedCallback(pendingTarget);
    }
    setIsDirty?.(false);
    setPendingTarget(null);
    setOnProceedCallback(null);
    setIsOpen(false);
  }, [pendingTarget, onProceedCallback, setIsDirty]);

  const cancelAction = useCallback(() => {
    setPendingTarget(null);
    setOnProceedCallback(null);
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    requestAction,
    confirmAction,
    cancelAction,
  };
}
