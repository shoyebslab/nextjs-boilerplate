import React from "react";
import { cn } from "@/lib/utils";

export interface PaginationLoaderProps {
  className?: string;
  size?: number;
}

export function PaginationLoader({ className }: PaginationLoaderProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-20",
        className
      )}
    >
      <div className="relative w-8 h-8">
        {Array.from({ length: 12 }).map((_, i) => {
          const rotate = i * 30;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-[30%] w-[8%] h-[24%] bg-primary rounded-full shadow-xs"
              style={{
                transform: `rotate(${rotate}deg) translate(0, -130%)`,
                animation: "paginationSpinner 1s linear infinite",
                animationDelay: `${-1.1 + i * 0.1}s`,
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes paginationSpinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}

export default PaginationLoader;
