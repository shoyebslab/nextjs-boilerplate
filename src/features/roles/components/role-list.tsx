"use client";

import React from "react";
import { Shield, Users, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleDetail } from "../types/role.types";

interface RoleListProps {
  roles: RoleDetail[];
}

export function RoleList({ roles }: RoleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role) => (
        <Card key={role.id} className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{role.name}</CardTitle>
              </div>
              <CardDescription className="text-xs">{role.description}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 font-mono text-xs">
              <Users className="h-3 w-3" />
              <span>{role.users_count} users</span>
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Key className="h-3 w-3" />
              <span>Assigned Permissions ({role.permissions.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {role.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-foreground"
                >
                  {perm}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
