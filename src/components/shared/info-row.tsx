import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  copyable?: boolean;
}

export function InfoRow({
  label,
  value,
  isLoading = false,
  className,
  labelClassName,
  valueClassName,
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between py-2 border-b border-border/60 last:border-b-0 gap-3",
        className
      )}
    >
      <span
        className={cn(
          "text-xs sm:text-sm font-medium text-muted-foreground shrink-0",
          labelClassName
        )}
      >
        {label}
      </span>

      {isLoading ? (
        <Skeleton className="h-4 w-28" />
      ) : (
        <span
          className={cn(
            "text-xs sm:text-sm font-semibold text-foreground text-right break-words",
            valueClassName
          )}
        >
          {value ?? "-"}
        </span>
      )}
    </div>
  );
}

export default InfoRow;
