"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReportCard } from "@/features/reports/components/report-card";
import { Users, DollarSign, TrendingUp, Cpu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Consolidated telemetry metrics and downloadable DRF data logs"
        action={
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-4 w-4" />
            <span>Export Analytics</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          title="Active Daily Inquiries"
          value="482"
          change="+18% vs yesterday"
          icon={TrendingUp}
        />
        <ReportCard
          title="Inpatient Billing (Nov)"
          value="$145,200"
          change="+9.5% on track"
          icon={DollarSign}
        />
        <ReportCard
          title="Consultations Logged"
          value="1,240"
          change="+32 new today"
          icon={Users}
        />
        <ReportCard
          title="Backend Compute Uptime"
          value="99.98%"
          change="Zero dropped frames"
          icon={Cpu}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Throughput Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center border-t text-xs text-muted-foreground">
            [Chart Component Visualizer - Aggregated via DRF /reports/analytics/ endpoint]
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Departmental Utilization</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center border-t text-xs text-muted-foreground">
            [Departmental Capacity Telemetry - Real-time Inpatient Flow]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
