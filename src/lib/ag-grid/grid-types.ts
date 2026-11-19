import { ColDef, GridReadyEvent } from "ag-grid-community";

export interface DataGridProps<TData> {
  rowData: TData[];
  columnDefs: ColDef<TData>[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  enableExport?: boolean;
  enableSearch?: boolean;
  height?: string | number;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (data: TData) => void;
  onGridReady?: (params: GridReadyEvent<TData>) => void;
}
