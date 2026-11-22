import React from "react";
import { WebsiteHeader } from "@/layouts/website/website-header";
import { WebsiteFooter } from "@/layouts/website/website-footer";
import { MobileBottomNav } from "@/components/website/mobile-bottom-nav";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pb-16 md:pb-0">
      <WebsiteHeader />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
      <MobileBottomNav />
    </div>
  );
}
