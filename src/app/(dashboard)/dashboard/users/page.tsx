"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/data-table/data-grid";
import { getUserColumns } from "@/features/users/components/user-columns";
import { UserItem } from "@/features/users/types/user.types";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PERMISSIONS } from "@/config/permissions.config";

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    email: "admin@starline.com",
    username: "admin",
    first_name: "Eleanor",
    last_name: "Vance",
    role: "SUPER_ADMIN",
    department: "Executive",
    is_active: true,
    date_joined: "2026-01-10",
  },
  {
    id: 2,
    email: "sarah.connor@starline.com",
    username: "sconnor",
    first_name: "Sarah",
    last_name: "Connor",
    role: "ADMIN",
    department: "Operations",
    is_active: true,
    date_joined: "2026-02-14",
  },
  {
    id: 3,
    email: "david.miller@starline.com",
    username: "dmiller",
    first_name: "David",
    last_name: "Miller",
    role: "MANAGER",
    department: "Clinical Staff",
    is_active: true,
    date_joined: "2026-03-20",
  },
  {
    id: 4,
    email: "clara.oswald@starline.com",
    username: "coswald",
    first_name: "Clara",
    last_name: "Oswald",
    role: "USER",
    department: "Reception",
    is_active: true,
    date_joined: "2026-04-05",
  },
  {
    id: 5,
    email: "arthur.pendelton@starline.com",
    username: "apendelton",
    first_name: "Arthur",
    last_name: "Pendelton",
    role: "USER",
    department: "Pharmacy",
    is_active: false,
    date_joined: "2026-05-18",
  },
];

export default function UsersPage() {
  const { checkAccess } = useAuth();
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = checkAccess({ permissions: [PERMISSIONS.USERS_CREATE] });
  const canDelete = checkAccess({ permissions: [PERMISSIONS.USERS_DELETE] });

  const columns = useMemo(
    () =>
      getUserColumns({
        onDelete: canDelete
          ? (user) => {
              setSelectedUser(user);
              setDeleteOpen(true);
            }
          : undefined,
      }),
    [canDelete]
  );

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers([...INITIAL_USERS]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Management"
        description="High-performance AG Grid registry connected to Django REST Framework backend"
        action={
          canCreate ? (
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link href="/dashboard/users/create">
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </Link>
            </Button>
          ) : undefined
        }
      />

      <DataGrid<UserItem>
        rowData={users}
        columnDefs={columns}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        title="System User Roster"
        subtitle="Quick filter text, sort by columns, or export to CSV"
        enableExport={true}
        enableSearch={true}
        pageSize={10}
        height="560px"
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to deactivate and remove ${selectedUser?.first_name} ${selectedUser?.last_name}? This action will revoke their DRF JWT tokens immediately.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
