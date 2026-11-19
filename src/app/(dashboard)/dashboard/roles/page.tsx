"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { RoleList } from "@/features/roles/components/role-list";
import { useRoles } from "@/features/roles/hooks/use-roles";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        description="Configure role definitions and granted access permissions across the system"
      />

      {isLoading ? (
        <LoadingSpinner text="Loading role definitions..." />
      ) : (
        <RoleList roles={roles || []} />
      )}
    </div>
  );
}
