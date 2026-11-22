"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { Button } from "@/components/ui/button";
import { HealthPackageData } from "@/features/settings/api/settings.api";

interface PackagesSectionProps {
  packages?: HealthPackageData[];
}

export function PackagesSection({ packages = [] }: PackagesSectionProps) {
  const { t, locale } = useLanguageStore();

  return (
    <section id="packages" className="py-14 sm:py-20 bg-background border-t">
      <div className="container max-w-6xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("প্রতিরোধমূলক স্বাস্থ্যসেবা", "PREVENTIVE HEALTH")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("জনপ্রিয় হেলথ চেকআপ প্যাকেজ", "Popular Health Checkup Packages")}
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 self-start sm:self-auto"
          >
            <Link href="/services#packages" className="gap-1.5">
              <span>{t("সকল ২২টি প্যাকেজ দেখুন", "View All 22 Packages")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => {
            const name = locale === "bn" ? pkg.name_bn : pkg.name_en;
            const audience =
              locale === "bn" ? pkg.target_audience_bn : pkg.target_audience_en;
            const features =
              locale === "bn" ? pkg.features_list_bn : pkg.features_list_en;

            return (
              <div
                key={pkg.id || pkg.name_en}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Top Popular Badge */}
                  <div className="mb-3">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-sm">
                      {t("জনপ্রিয়", "POPULAR")}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {name}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {audience}
                  </p>

                  {/* Pricing Box */}
                  <div className="mt-4 pt-3 border-t border-dashed flex items-baseline gap-2">
                    {pkg.original_price > pkg.discounted_price && (
                      <span className="text-xs text-muted-foreground line-through font-mono">
                        ৳{pkg.original_price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-black text-red-600 font-mono tracking-tight">
                      ৳{pkg.discounted_price.toLocaleString()}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-4 space-y-2">
                    {features.slice(0, 5).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Button */}
                <div className="pt-5 mt-4 border-t border-border/60">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={pkg.details_url || "/services#packages"}>
                      {t("টেস্টের সম্পূর্ণ তালিকা দেখুন", "View Full Test List")}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
