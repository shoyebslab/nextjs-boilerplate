"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";
import { useUiStore } from "@/stores/ui.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { toggleSidebar } = useUiStore();
  const { user } = useAuth();

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || "U"}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <DashboardBreadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors sm:flex"
        >
          <span>Website</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <div className="h-5 w-[1px] bg-border" />

        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-none">{user.first_name} {user.last_name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{user.role}</p>
            </div>
            <LogoutButton variant="ghost" size="sm" className="hidden sm:flex" />
          </div>
        )}
      </div>
    </header>
  );
}
