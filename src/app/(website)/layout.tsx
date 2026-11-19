import React from "react";
import { WebsiteHeader } from "@/layouts/website/website-header";
import { WebsiteFooter } from "@/layouts/website/website-footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WebsiteHeader />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  );
}
