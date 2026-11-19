"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS, RoleType } from "@/config/permissions.config";
import { Check, X } from "lucide-react";

export default function PermissionsPage() {
  const allPermissions = Object.values(PERMISSIONS);
  const roleList: RoleType[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Matrix"
        description="Review RBAC authorization boundaries applied across API routes and client views"
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Role-to-Permission Mapping</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-y">
              <tr>
                <th className="px-4 py-3 font-semibold">Permission Key</th>
                {roleList.map((role) => (
                  <th key={role} className="px-4 py-3 font-semibold text-center">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {allPermissions.map((perm) => (
                <tr key={perm} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-foreground">
                    {perm}
                  </td>
                  {roleList.map((role) => {
                    const hasPerm =
                      role === ROLES.SUPER_ADMIN ||
                      ROLE_PERMISSIONS[role].includes(perm);

                    return (
                      <td key={role} className="px-4 py-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <X className="h-3 w-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
