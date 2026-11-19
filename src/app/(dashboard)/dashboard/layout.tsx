import React from "react";
import { DashboardShell } from "@/layouts/dashboard/dashboard-shell";

export const metadata = {
  title: "Console Dashboard",
  description: "Enterprise Operations and Administration Console",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
