import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building, Users, Award } from "lucide-react";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="container py-10 space-y-8 max-w-5xl">
      <PageHeader
        title="About Starline Enterprise"
        description="Scalable digital infrastructure for enterprise applications and clinical portals"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Building className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Modern Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Constructed with Next.js 15 App Router, TypeScript, Tailwind CSS, and Django REST Framework.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Multi-Role Governance</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Complete role hierarchies including Super Admin, Admin, Manager, and Staff User accounts.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Award className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Production Grade</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Standardized with automated SimpleJWT token refresh queues and AG Grid Quartz tables.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
