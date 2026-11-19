"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { useTheme } from "next-themes";
import { DataGridProps } from "@/lib/ag-grid/grid-types";
import { DEFAULT_GRID_COL_DEF, GRID_THEMES } from "@/lib/ag-grid/grid-defaults";
import { GridToolbar } from "./grid-toolbar";
import { GridExport } from "./grid-export";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export function DataGrid<TData>({
  rowData,
  columnDefs,
  isLoading = false,
  title,
  subtitle,
  onRefresh,
  enableExport = true,
  enableSearch = true,
  height = "520px",
  pagination = true,
  pageSize = 10,
  onRowClick,
  onGridReady: parentOnGridReady,
}: DataGridProps<TData>) {
  const gridRef = useRef<AgGridReact<TData>>(null);
  const [gridApi, setGridApi] = useState<GridApi<TData> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";
  const themeClass = isDarkMode ? GRID_THEMES.DARK : GRID_THEMES.LIGHT;

  const defaultColDef = useMemo<ColDef>(() => DEFAULT_GRID_COL_DEF, []);

  const handleGridReady = useCallback(
    (params: GridReadyEvent<TData>) => {
      setGridApi(params.api);
      if (parentOnGridReady) {
        parentOnGridReady(params);
      }
    },
    [parentOnGridReady]
  );

  const handleExport = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `${title ? title.toLowerCase().replace(/\s+/g, "-") : "grid-export"}.csv`,
      });
    }
  }, [gridApi, title]);

  return (
    <div className="w-full space-y-3">
      {(title || enableSearch || enableExport || onRefresh) && (
        <div className="flex flex-col gap-2">
          {title && (
            <div>
              <h2 className="text-base font-semibold tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}

          <GridToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={onRefresh}
            isLoading={isLoading}
            actions={
              enableExport ? (
                <GridExport onExport={handleExport} disabled={isLoading} />
              ) : undefined
            }
          />
        </div>
      )}

      <div
        className={`${themeClass} w-full rounded-md border shadow-sm overflow-hidden transition-colors`}
        style={{ height }}
      >
        <AgGridReact<TData>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={searchQuery}
          onGridReady={handleGridReady}
          pagination={pagination}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          rowSelection={{ mode: "singleRow" }}
          loading={isLoading}
          onRowClicked={(event) => {
            if (onRowClick && event.data) {
              onRowClick(event.data);
            }
          }}
          animateRows={true}
        />
      </div>
    </div>
  );
}
