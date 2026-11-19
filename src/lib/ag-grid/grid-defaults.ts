import { ColDef } from "ag-grid-community";

export const DEFAULT_GRID_COL_DEF: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

export const GRID_THEMES = {
  LIGHT: "ag-theme-quartz",
  DARK: "ag-theme-quartz-dark",
} as const;
