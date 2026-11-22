"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, Lock, CalendarCheck, Siren } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { TopbarData } from "@/features/settings/api/settings.api";
import { cn } from "@/lib/utils";

interface TopbarProps {
  data?: TopbarData;
  className?: string;
}

export function Topbar({ data, className }: TopbarProps) {
  const { locale, setLocale, t } = useLanguageStore();

  const hotline = data?.hotline || "+8809611177177";
  const phoneDisplay = data?.phone_display || "09611-177177";
  const ambulance = data?.ambulance || "01844-477701";
  const email = data?.email || "info@starlinehospital.com.bd";

  return (
    <div
      className={cn(
        "w-full bg-[#0b2545] text-slate-200 text-xs py-2 border-b border-white/10 transition-colors",
        className
      )}
    >
      <div className="container flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Information */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">{email}</span>
          </a>

          <span className="hidden md:inline h-3.5 w-[1px] bg-white/20" />

          <div className="inline-flex items-center gap-1.5 text-slate-300">
            <Siren className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span className="text-white/70 hidden sm:inline">{t("অ্যাম্বুলেন্স:", "Ambulance:")}</span>
            <a
              href={`tel:${ambulance}`}
              className="text-white font-semibold hover:text-sky-300 transition-colors"
            >
              {ambulance}
            </a>
          </div>
        </div>

        {/* Right Actions & Hotline */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={`tel:${hotline}`}
            className="inline-flex items-center gap-1.5 text-slate-100 hover:text-white font-medium transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-bold tracking-tight">{phoneDisplay}</span>
          </a>

          <span className="h-3.5 w-[1px] bg-white/20" />

          {/* Language Switcher */}
          <div className="inline-flex items-center rounded-md bg-white/10 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLocale("bn")}
              className={cn(
                "px-2 py-0.5 rounded transition-all",
                locale === "bn"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              )}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "px-2 py-0.5 rounded transition-all",
                locale === "en"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              )}
            >
              EN
            </button>
          </div>

          {/* Book Appointment CTA */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <CalendarCheck className="h-3 w-3" />
            <span>{t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}</span>
          </Link>

          {/* Staff Login shortcut */}
          <Link
            href="/login"
            title={t("স্টাফ লগইন", "Staff Login")}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
