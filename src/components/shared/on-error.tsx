"use client";

import React from "react";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OnErrorProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  onReset?: () => void;
  retryText?: string;
  resetText?: string;
  className?: string;
}

export function OnError({
  message = "Something went wrong!",
  description = "An unexpected error occurred while loading this section. Please try again.",
  onRetry,
  onReset,
  retryText = "Retry",
  resetText = "Reset",
  className,
}: OnErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center shadow-xs backdrop-blur-xs",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-semibold text-destructive">{message}</h3>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>

      {(onRetry || onReset) && (
        <div className="flex items-center gap-2 pt-2">
          {onRetry && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRetry}
              className="gap-1.5 shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {retryText}
            </Button>
          )}

          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {resetText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default OnError;
