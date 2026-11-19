"use client";

import React from "react";
import Link from "next/link";
import { Users, DollarSign, Activity, ArrowRight, ShieldCheck, Database } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReportCard } from "@/features/reports/components/report-card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROLES, PERMISSIONS } from "@/config/permissions.config";

export default function DashboardOverviewPage() {
  const { user, checkAccess } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.first_name || "Operator"}`}
        description={`Console Session • Access Role: ${user?.role || "USER"}`}
        action={
          checkAccess({ permissions: [PERMISSIONS.USERS_CREATE] }) ? (
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link href="/dashboard/users/create">
                <Users className="h-4 w-4" />
                <span>Add User</span>
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard
          title="Total Active Users"
          value="1,420"
          change="+8.4% this month"
          icon={Users}
        />
        <ReportCard
          title="Monthly Throughput"
          value="$284,500"
          change="+14.2% vs target"
          icon={DollarSign}
        />
        <ReportCard
          title="API Response Time"
          value="42 ms"
          change="-5 ms latency improvement"
          icon={Activity}
        />
        <ReportCard
          title="DRF Integration Health"
          value="100% Online"
          change="All simplejwt endpoints passing"
          icon={Database}
        />
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Operations Telemetry</CardTitle>
            <CardDescription className="text-xs">
              Direct links to high-density AG Grid tables and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard/users"
              className="flex items-center justify-between rounded-lg border p-4 hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold">User Directory (AG Grid)</p>
                <p className="text-xs text-muted-foreground">High-performance data table with quick filtering</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>

            <Link
              href="/dashboard/reports"
              className="flex items-center justify-between rounded-lg border p-4 hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold">Reports & Analytics</p>
                <p className="text-xs text-muted-foreground">System telemetry, query caching, and metrics</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          </CardContent>
        </Card>

        {/* Security & RBAC Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Active Permissions</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Role permissions assigned to current profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded bg-muted p-2.5 text-xs font-mono space-y-1">
              <p><span className="text-muted-foreground">Role:</span> {user?.role}</p>
              <p><span className="text-muted-foreground">Account:</span> {user?.email}</p>
              <p><span className="text-muted-foreground">Scope:</span> Enterprise Dashboard</p>
            </div>

            {checkAccess({ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] }) && (
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                  <Link href="/dashboard/roles">Manage Roles & Permissions</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
