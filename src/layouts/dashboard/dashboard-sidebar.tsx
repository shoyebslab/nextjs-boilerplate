"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  Key,
  Settings,
  Sliders,
  Menu,
  Images,
  Building2,
  Stethoscope,
  Package,
  ChevronDown,
  ChevronRight,
  Activity,
  LucideIcon,
} from "lucide-react";
import { DASHBOARD_NAV_SECTIONS } from "@/config/navigation.config";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/common.types";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  Key,
  Settings,
  Sliders,
  Menu,
  Images,
  Building2,
  Stethoscope,
  Activity,
  Package,
};

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, checkAccess } = useAuth();
  const { sidebarOpen } = useUiStore();
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    "/dashboard/settings": true,
  });

  const toggleExpand = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedKeys((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

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
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isParentActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const isExpanded =
                    expandedKeys[item.href] ?? (isParentActive || false);

                  // Filter visible children based on permissions
                  const visibleChildren = item.children
                    ? item.children.filter((child) =>
                        checkAccess({
                          roles: child.roles as any,
                          permissions: child.permissions as any,
                        })
                      )
                    : [];

                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          title={!sidebarOpen ? item.title : undefined}
                          className={cn(
                            "flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                            isParentActive && !hasChildren
                              ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                              : isParentActive
                              ? "text-sidebar-primary-foreground font-semibold"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            !sidebarOpen && "justify-center px-0"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {sidebarOpen && <span className="flex-1">{item.title}</span>}
                        </Link>

                        {hasChildren && sidebarOpen && (
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(item.href, e)}
                            className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                            aria-label={`Toggle ${item.title} submenu`}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Sub-menu items (Topbar, Navbar, Slider) */}
                      {hasChildren && sidebarOpen && isExpanded && (
                        <div className="ml-5 pl-3 border-l border-sidebar-border space-y-1 pt-0.5">
                          {visibleChildren.map((child: NavItem) => {
                            const ChildIcon = child.icon
                              ? ICONS[child.icon] || LayoutDashboard
                              : LayoutDashboard;
                            const isChildActive = pathname === child.href;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                  isChildActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{child.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
