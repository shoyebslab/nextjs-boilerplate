"use client";

import React from "react";
import { Topbar } from "@/components/website/topbar";
import { Navbar } from "@/components/website/navbar";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";

export function WebsiteHeader() {
  const { topbar, navbar } = useSiteSettings();

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col shadow-sm">
      <Topbar data={topbar} />
      <Navbar items={navbar} />
    </header>
  );
}
