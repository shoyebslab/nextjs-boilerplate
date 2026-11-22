"use client";

import React from "react";
import Link from "next/link";
import { Phone, Stethoscope, CalendarCheck, FileText, Siren } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { TopbarData } from "@/features/settings/api/settings.api";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";

interface MobileBottomNavProps {
  topbar?: TopbarData;
}

export function MobileBottomNav({ topbar: propTopbar }: MobileBottomNavProps) {
  const { t } = useLanguageStore();
  const { topbar: hookTopbar } = useSiteSettings();

  const topbar = propTopbar || hookTopbar;
  const hotline = topbar?.hotline || "+8809611177177";
  const ambulance = topbar?.ambulance || "01844-477701";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)] py-1 px-2"
    >
      <div className="flex justify-around items-center text-center">
        {/* Hotline */}
        <a
          href={`tel:${hotline}`}
          className="flex flex-col items-center justify-center p-1 text-red-600 hover:text-red-700 transition-colors"
        >
          <Phone className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t("হটলাইন", "Hotline")}</span>
        </a>

        {/* Doctors */}
        <Link
          href="/services#doctors"
          className="flex flex-col items-center justify-center p-1 text-primary hover:text-primary/80 transition-colors"
        >
          <Stethoscope className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t("ডাক্তারগণ", "Doctors")}</span>
        </Link>

        {/* Book Appointment (Centered Elevated CTA) */}
        <Link
          href="/contact"
          className="flex flex-col items-center justify-center -mt-4 bg-primary text-primary-foreground px-3.5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <CalendarCheck className="h-5 w-5" />
          <span className="text-[10px] font-extrabold tracking-tight mt-0.5">{t("সিরিয়াল", "Book")}</span>
        </Link>

        {/* Diagnostic Report */}
        <a
          href="https://report.starlinehospital.com.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t("রিপোর্ট", "Report")}</span>
        </a>

        {/* Ambulance */}
        <a
          href={`tel:${ambulance}`}
          className="flex flex-col items-center justify-center p-1 text-amber-500 hover:text-amber-600 transition-colors"
        >
          <Siren className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{t("অ্যাম্বুলেন্স", "Ambulance")}</span>
        </a>
      </div>
    </nav>
  );
}
