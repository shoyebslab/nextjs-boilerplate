"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Scan,
  Siren,
  Activity,
  FlaskConical,
  Brain,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { ClinicalFacilityData } from "@/features/settings/api/settings.api";

const FACILITY_ICONS: Record<string, LucideIcon> = {
  HeartPulse,
  Scan,
  Siren,
  Activity,
  FlaskConical,
  Brain,
};

interface FacilitiesSectionProps {
  facilities?: ClinicalFacilityData[];
}

export function FacilitiesSection({ facilities = [] }: FacilitiesSectionProps) {
  const { t, locale } = useLanguageStore();

  return (
    <section id="services" className="py-14 sm:py-20 bg-muted/20 border-t">
      <div className="container max-w-6xl space-y-10">
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {t("ডায়াগনস্টিক ও ক্লিনিক্যাল সুবিধা", "CLINICAL FACILITIES")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("সর্বাধুনিক ডায়াগনস্টিক ও হাসপাতাল সেবা", "Advanced Diagnostic & Clinical Services")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t(
              "আন্তর্জাতিক মানের মেশিনারিজ ও দক্ষ মেডিকেল টেকনোলজিস্টদের নির্ভুল রোগ নির্ণয়",
              "Accurate results with world-class medical technologies"
            )}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => {
            const Icon = FACILITY_ICONS[fac.icon_name] || Activity;
            const title = locale === "bn" ? fac.title_bn : fac.title_en;
            const subtitle = locale === "bn" ? fac.subtitle_bn : fac.subtitle_en;
            const desc = locale === "bn" ? fac.description_bn : fac.description_en;

            return (
              <div
                key={fac.id || fac.title_en}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>

                  {subtitle && (
                    <p className="text-xs font-medium text-sky-700 dark:text-sky-300 mt-1">
                      {subtitle}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60">
                  <Link
                    href={fac.read_more_url || "/services"}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{t("বিস্তারিত পড়ুন", "Read Details")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
