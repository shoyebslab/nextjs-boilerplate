"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, GripHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  isDanger?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-2xl",
  isDanger = false,
  className,
  headerClassName,
  bodyClassName,
}: DraggableModalProps) {
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const updateConstraints = useCallback(() => {
    if (!modalRef.current || !boundsRef.current) return;

    const modalRect = modalRef.current.getBoundingClientRect();
    const boundsRect = boundsRef.current.getBoundingClientRect();

    const maxDragX = Math.max(0, (boundsRect.width - modalRect.width) / 2);
    const maxDragY = Math.max(0, (boundsRect.height - modalRect.height) / 1.5);

    setDragConstraints({
      left: -maxDragX,
      right: maxDragX,
      top: -maxDragY,
      bottom: maxDragY,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateConstraints, 100);
      window.addEventListener("resize", updateConstraints);

      return () => {
        window.removeEventListener("resize", updateConstraints);
        clearTimeout(timer);
      };
    }
  }, [isOpen, updateConstraints]);

  const handleBackdropClick = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={boundsRef}
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/60 backdrop-blur-xs pt-[8vh] p-3 sm:p-4"
        >
          <motion.div
            ref={modalRef}
            drag
            dragConstraints={dragConstraints}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={updateConstraints}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: shake ? [1, 1.03, 0.98, 1.02, 1] : 1,
            }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{
              scale: { duration: shake ? 0.35 : 0.2, ease: "easeOut" },
              opacity: { duration: 0.2 },
              y: { type: "spring", stiffness: 350, damping: 25 },
            }}
            className={cn(
              "relative w-full max-h-[85vh] flex flex-col rounded-xl border bg-background text-foreground shadow-2xl overflow-hidden cursor-default select-text",
              width,
              className
            )}
          >
            {/* Header: drag handle */}
            <div
              className={cn(
                "sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 cursor-move select-none",
                isDanger
                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                  : "border-border bg-muted/40",
                headerClassName
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <GripHorizontal className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                <h3 className="text-sm sm:text-base font-semibold truncate tracking-tight">
                  {title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={cn(
                  "shrink-0 rounded-md p-1.5 transition-colors cursor-pointer",
                  isDanger
                    ? "text-destructive hover:bg-destructive/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Area */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-5 max-h-[calc(85vh-60px)]",
                bodyClassName
              )}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default DraggableModal;
