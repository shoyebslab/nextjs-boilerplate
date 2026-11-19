import React from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { UserItem } from "../types/user.types";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface UserColumnOptions {
  onEdit?: (user: UserItem) => void;
  onDelete?: (user: UserItem) => void;
}

export function getUserColumns(options?: UserColumnOptions): ColDef<UserItem>[] {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      pinned: "left",
      cellClass: "font-mono text-xs text-muted-foreground",
    },
    {
      headerName: "Full Name",
      valueGetter: (params) =>
        `${params.data?.first_name || ""} ${params.data?.last_name || ""}`,
      minWidth: 160,
      cellClass: "font-semibold text-xs",
    },
    {
      field: "email",
      headerName: "Email Address",
      minWidth: 200,
      cellClass: "text-xs",
    },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      cellRenderer: (params: ICellRendererParams<UserItem>) => {
        const role = params.value;
        const variant =
          role === "SUPER_ADMIN" || role === "ADMIN"
            ? "default"
            : role === "MANAGER"
            ? "secondary"
            : "outline";
        return <Badge variant={variant}>{role}</Badge>;
      },
    },
    {
      field: "department",
      headerName: "Department",
      width: 140,
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 110,
      cellRenderer: (params: ICellRendererParams<UserItem>) => (
        <Badge variant={params.value ? "success" : "destructive"}>
          {params.value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      headerName: "Actions",
      width: 120,
      pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<UserItem>) => {
        const item = params.data;
        if (!item) return null;
        return (
          <div className="flex items-center gap-1.5 h-full">
            <Link
              href={`/dashboard/users/${item.id}`}
              className="p-1 hover:text-primary transition-colors text-muted-foreground"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            {options?.onEdit && (
              <button
                onClick={() => options.onEdit?.(item)}
                className="p-1 hover:text-primary transition-colors text-muted-foreground"
                title="Edit User"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {options?.onDelete && (
              <button
                onClick={() => options.onDelete?.(item)}
                className="p-1 hover:text-destructive transition-colors text-muted-foreground"
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}
