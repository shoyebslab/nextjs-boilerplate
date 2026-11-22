"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { DraggableModal } from "./draggable-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmSymbol = "warning" | "danger" | "info" | "success";

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  text?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  loadingText?: string;
  showSubtext?: boolean;
  subtext?: string;
  symbol?: ConfirmSymbol;
}

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  text = "Are you sure you want to proceed?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Processing",
  showSubtext = true,
  subtext = "This action is permanent and cannot be undone.",
  symbol = "warning",
}: ConfirmModalProps) {
  const getSymbolConfig = () => {
    switch (symbol) {
      case "danger":
        return {
          bg: "bg-destructive/10",
          ring: "ring-destructive/20",
          iconColor: "text-destructive",
          buttonVariant: "destructive" as const,
          Icon: Trash2,
        };
      case "info":
        return {
          bg: "bg-blue-500/10",
          ring: "ring-blue-500/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          buttonVariant: "default" as const,
          Icon: Info,
        };
      case "success":
        return {
          bg: "bg-emerald-500/10",
          ring: "ring-emerald-500/20",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          buttonVariant: "default" as const,
          Icon: CheckCircle2,
        };
      case "warning":
      default:
        return {
          bg: "bg-amber-500/10",
          ring: "ring-amber-500/20",
          iconColor: "text-amber-600 dark:text-amber-400",
          buttonVariant: "destructive" as const,
          Icon: AlertTriangle,
        };
    }
  };

  const config = getSymbolConfig();
  const IconComponent = config.Icon;

  return (
    <DraggableModal
      isOpen={open}
      onClose={() => !loading && onOpenChange(false)}
      title={title || ""}
      width="max-w-md"
      isDanger={symbol === "danger"}
    >
      <div className="flex flex-col items-center text-center space-y-3 py-1">
        {/* Symbol Icon Ring */}
        <div
          className={cn(
            "h-12 w-12 flex items-center justify-center rounded-full ring-8 transition-transform",
            config.bg,
            config.ring
          )}
        >
          <IconComponent className={cn("h-6 w-6", config.iconColor)} />
        </div>

        {/* Text Header */}
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-semibold text-foreground leading-snug">
            {text}
          </h3>

          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {showSubtext && (
            <p className="text-[11px] text-muted-foreground/80 pt-0.5">
              {subtext}
            </p>
          )}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-3 w-full pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={config.buttonVariant}
            disabled={loading}
            onClick={onConfirm}
            className="w-full gap-2 shadow-xs"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? `${loadingText}...` : confirmText}
          </Button>
        </div>
      </div>
    </DraggableModal>
  );
}

export default ConfirmModal;
