"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { WebsiteNavbar } from "./website-navbar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { WEBSITE_NAV } from "@/config/navigation.config";

export function WebsiteHeader() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <WebsiteNavbar className="hidden md:flex" />

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link href="/dashboard">
                <ShieldCheck className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="gap-1 shadow-sm">
                <Link href="/dashboard">
                  <span>Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden space-y-3">
          <div className="flex flex-col space-y-2">
            {WEBSITE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="border-t pt-3 flex flex-col gap-2">
            <Button asChild size="sm" className="w-full">
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? "Go to Dashboard" : "Sign In to Portal"}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
