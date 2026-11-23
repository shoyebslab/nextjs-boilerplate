"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useLanguageStore } from "@/stores/language.store";
import { NavbarItemData } from "@/features/settings/api/settings.api";
import { cn } from "@/lib/utils";

interface NavbarProps {
  items?: NavbarItemData[];
  className?: string;
}

export function Navbar({ items = [], className }: NavbarProps) {
  const pathname = usePathname();
  const { locale, t } = useLanguageStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItems = items.filter((item) => item.is_active);

  return (
    <nav
      className={cn(
        "w-full bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Nav Items */}
        <div className="hidden xl:flex items-center gap-1.5">
          {activeItems.map((item) => {
            const isActive = pathname === item.href;
            const label = locale === "bn" ? item.title_bn : item.title_en;

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.is_external ? "_blank" : undefined}
                rel={item.is_external ? "noopener noreferrer" : undefined}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[#0b3c6f] text-white"
                    : "text-[#0b3c6f] dark:text-slate-200 hover:bg-[#0b3c6f]/10 dark:hover:bg-slate-800"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="text-[#0b3c6f] dark:text-slate-200"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileOpen && (
        <div className="border-b bg-background px-4 py-4 xl:hidden space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {activeItems.map((item) => {
              const label = locale === "bn" ? item.title_bn : item.title_en;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-[#0b3c6f] text-white"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t">
            <Button asChild size="sm" className="w-full gap-2">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                <CalendarCheck className="h-4 w-4" />
                <span>{t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
