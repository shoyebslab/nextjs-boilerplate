"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WEBSITE_NAV } from "@/config/navigation.config";
import { cn } from "@/lib/utils";

export function WebsiteNavbar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {WEBSITE_NAV.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
