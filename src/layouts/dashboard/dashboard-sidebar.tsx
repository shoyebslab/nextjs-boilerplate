"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  Key,
  Settings,
  Activity,
  LucideIcon,
} from "lucide-react";
import { DASHBOARD_NAV_SECTIONS } from "@/config/navigation.config";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  Key,
  Settings,
};

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, checkAccess } = useAuth();
  const { sidebarOpen } = useUiStore();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Activity className="h-5 w-5" />
        </div>
        {sidebarOpen && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold tracking-tight text-sidebar-foreground text-sm truncate">
              Starline Console
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono">
              DRF + NEXT.JS
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {DASHBOARD_NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            checkAccess({ roles: item.roles as any, permissions: item.permissions as any })
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {sidebarOpen && (
                <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
              )}
              <nav className="space-y-1 pt-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon ? ICONS[item.icon] || LayoutDashboard : LayoutDashboard;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!sidebarOpen ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        !sidebarOpen && "justify-center px-0"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {sidebarOpen && (
        <div className="border-t border-sidebar-border p-3 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DRF Connected</span>
          </div>
          <span className="text-[10px] font-mono">{user?.role}</span>
        </div>
      )}
    </aside>
  );
}
