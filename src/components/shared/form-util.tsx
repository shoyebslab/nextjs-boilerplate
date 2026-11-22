import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visual indicator for mandatory form fields
 */
export const RequiredStar = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn("text-destructive font-bold ml-0.5", className)}
      aria-hidden="true"
    >
      *
    </span>
  );
};

export interface LoadingStateProps {
  text?: string;
  spinColor?: string;
  size?: number;
  className?: string;
}

/**
 * Inline loading spinner with optional text for buttons and submit states
 */
export const LoadingState = ({
  text,
  spinColor = "text-current",
  size = 16,
  className,
}: LoadingStateProps) => {
  return (
    <span className={cn("inline-flex items-center justify-center gap-2", className)}>
      <Loader2
        style={{ width: size, height: size }}
        className={cn("animate-spin", spinColor)}
      />
      {text && <span>{text}</span>}
    </span>
  );
};

export interface FieldSkeletonProps {
  labelWidth?: string;
  inputHeight?: string;
  className?: string;
}

/**
 * Skeleton placeholder for input field + label loading state
 */
export const FieldSkeleton = ({
  labelWidth = "w-24",
  inputHeight = "h-9",
  className,
}: FieldSkeletonProps) => (
  <div className={cn("space-y-1.5", className)}>
    <div className={cn("h-3.5 bg-muted rounded animate-pulse", labelWidth)} />
    <div className={cn("w-full bg-muted rounded-md animate-pulse", inputHeight)} />
  </div>
);

/**
 * Standard inline form error display
 */
export const FormErrorMessage = ({
  error,
  className,
}: {
  error?: string | null;
  className?: string;
}) => {
  if (!error) return null;
  return (
    <p className={cn("text-xs font-medium text-destructive mt-1", className)}>
      {error}
    </p>
  );
};
