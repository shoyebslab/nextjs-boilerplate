import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function ReportCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  className,
}: ReportCardProps) {
  return (
    <Card className={cn("hover:shadow-sm transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "text-[11px] mt-1 font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
