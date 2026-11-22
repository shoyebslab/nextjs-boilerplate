"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { useTheme } from "next-themes";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubLoader } from "@/components/shared/sub-loader";
import { cn } from "@/lib/utils";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export interface SidebarGridPanelProps<TData = any> {
  columnDefs: ColDef<TData>[];
  data: TData[];
  onRowClicked?: (event: RowClickedEvent<TData>) => void;
  height?: string;
  placeholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  rowHeight?: number;
  pageSize?: number;
  className?: string;
}

export function SidebarGridPanel<TData = any>({
  columnDefs,
  data,
  onRowClicked,
  height = "h-[480px]",
  placeholder = "Search list...",
  emptyMessage = "No records found",
  isLoading = false,
  rowHeight = 36,
  pageSize = 25,
  className,
}: SidebarGridPanelProps<TData>) {
  const [quickFilterText, setQuickFilterText] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      suppressMovable: true,
      filter: false,
      resizable: true,
    }),
    []
  );

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs rounded-md"
        />
        {quickFilterText && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setQuickFilterText("")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Grid or Loader */}
      <div className={cn("w-full rounded-md border overflow-hidden shadow-xs", height)}>
        {isLoading ? (
          <div className="p-3 h-full overflow-hidden bg-background">
            <SubLoader rows={8} columns={columnDefs.length || 3} />
          </div>
        ) : (
          <div
            className={cn(
              isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz",
              "w-full h-full"
            )}
          >
            <AgGridReact<TData>
              rowData={data}
              columnDefs={columnDefs}
              quickFilterText={quickFilterText}
              defaultColDef={defaultColDef}
              rowHeight={rowHeight}
              headerHeight={40}
              pagination={true}
              paginationPageSize={pageSize}
              paginationPageSizeSelector={[10, 25, 50]}
              rowSelection={{ mode: "singleRow" }}
              onRowClicked={onRowClicked}
              animateRows={true}
              overlayNoRowsTemplate={`<div class="flex flex-col items-center justify-center p-4 text-xs text-muted-foreground">${emptyMessage}</div>`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(SidebarGridPanel) as typeof SidebarGridPanel;
