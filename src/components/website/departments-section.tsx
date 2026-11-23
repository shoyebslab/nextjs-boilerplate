"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Brain,
  Baby,
  Activity,
  Bone,
  Stethoscope,
  Pill,
  Scan,
  ShieldAlert,
  HeartHandshake,
  HeartPulse,
  Cross,
  Droplets,
  Building2,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DepartmentData } from "@/features/settings/api/settings.api";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldAlert,
  HeartHandshake,
  HeartPulse,
  Heart,
  Activity,
  Baby,
  Droplets,
  Brain,
  Bone,
  Stethoscope,
  Pill,
  Scan,
  Cross,
  Building2,
};

interface DepartmentsSectionProps {
  departments?: DepartmentData[];
}

export function DepartmentsSection({ departments = [] }: DepartmentsSectionProps) {
  const { t, locale } = useLanguageStore();

  return (
    <section id="departments" className="py-14 sm:py-20 bg-muted/20 border-t">
      <div className="container max-w-6xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("বিশেষায়িত সেবা", "Specialized Care")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("আমাদের বিশেষায়িত বিভাগসমূহ", "Our Specialties & Departments")}
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 self-start sm:self-auto"
          >
            <Link href="/services#departments" className="gap-1.5">
              <span>{t("সকল বিভাগ দেখুন", "View All Departments")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept) => {
            const Icon = ICON_MAP[dept.icon_name] || Building2;
            const title = locale === "bn" ? dept.name_bn : dept.name_en;
            const subtitle =
              locale === "bn"
                ? dept.subtitle_bn || dept.description_bn
                : dept.subtitle_en || dept.description_en;

            return (
              <div
                key={dept.id || dept.name_en}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-sky-800 group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {subtitle || t("বিশেষজ্ঞ চিকিৎসা ও নিবিড় পরিচর্যা সেবা।", "Specialized clinical diagnosis and inpatient care.")}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                  <Badge variant="secondary" className="text-[11px] font-normal gap-1 px-2.5 py-0.5">
                    <Stethoscope className="h-3 w-3 text-primary" />
                    <span>
                      {dept.doctor_count} {t("জন ডাক্তার", "Doctors")}
                    </span>
                  </Badge>

                  <Link
                    href={`/services#${dept.dept_url || "departments"}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("বিস্তারিত", "Details")}</span>
                    <ArrowRight className="h-3 w-3" />
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
