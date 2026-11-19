import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Shield, Calendar, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6 max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground -ml-2">
        <Link href="/dashboard/users">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </Button>

      <PageHeader
        title={`User Profile: ID #${id}`}
        description="Detailed operator metadata, assigned permissions, and activity history"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Account Information</CardTitle>
              <Badge variant="success">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <p className="font-semibold text-sm mt-0.5">Eleanor Vance</p>
              </div>
              <div>
                <span className="text-muted-foreground">Username:</span>
                <p className="font-mono mt-0.5">admin</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>admin@starline.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <Badge variant="default">SUPER_ADMIN</Badge>
              </div>
            </div>

            <div className="border-t pt-3 flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Registered on January 10, 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Access Level</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>Role grants unrestricted administrative command over all DRF endpoints and views.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
