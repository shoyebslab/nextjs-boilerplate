import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Cpu, Database, Network } from "lucide-react";

export const metadata = {
  title: "Services & Capabilities",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Django REST Framework Integration",
      icon: Database,
      desc: "Robust API client with automatic token refreshing, serialization mapping, and error isolation.",
    },
    {
      title: "AG Grid High-Speed Telemetry",
      icon: Cpu,
      desc: "Client-side and server-side data virtualization with multi-column sorting and filtering.",
    },
    {
      title: "Granular Role-Based Access Control",
      icon: ShieldCheck,
      desc: "Hierarchical permissions enforced across edge middleware and React component trees.",
    },
    {
      title: "Multi-Domain Theming Architecture",
      icon: Network,
      desc: "Scoped CSS variables enabling separate brand colors for public visitors and dashboard operators.",
    },
  ];

  return (
    <div className="container py-10 space-y-8 max-w-5xl">
      <PageHeader
        title="Enterprise Capabilities"
        description="Comprehensive full-stack services engineered for high reliability"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title}>
              <CardHeader>
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription className="text-xs">{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
