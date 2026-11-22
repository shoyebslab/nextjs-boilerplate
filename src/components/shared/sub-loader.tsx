import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SubLoaderProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

const GRID_COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

export function SubLoader({
  rows = 8,
  columns = 5,
  showHeader = true,
  className,
}: SubLoaderProps) {
  const gridClass = GRID_COLS_CLASS[columns] || "grid-cols-5";

  return (
    <div className={cn("w-full rounded-md border border-border/60 overflow-hidden bg-card", className)}>
      {showHeader && (
        <>
          {/* Header */}
          <div className={cn("grid bg-muted/50 border-b border-border/60 p-3 gap-4", gridClass)}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`h-${colIndex}`} className="h-6 rounded" />
            ))}
          </div>

          {/* Sub Header */}
          <div className={cn("grid bg-muted/20 border-b border-border/40 p-2.5 gap-4", gridClass)}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`sh-${colIndex}`} className="h-4 rounded" />
            ))}
          </div>
        </>
      )}

      {/* Rows */}
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className={cn("grid p-3 gap-4 items-center", gridClass)}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 rounded-sm" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubLoader;
