"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorData } from "@/features/settings/api/settings.api";

interface DoctorsSectionProps {
  doctors?: DoctorData[];
}

export function DoctorsSection({ doctors = [] }: DoctorsSectionProps) {
  const { t, locale } = useLanguageStore();

  return (
    <section id="doctors" className="py-14 sm:py-20 bg-background border-t">
      <div className="container max-w-6xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("অভিজ্ঞ চিকিৎসকবৃন্দ", "MEDICAL TEAM")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("আমাদের প্রখ্যাত বিশেষজ্ঞ ডাক্তারগণ", "Our Specialist Doctors")}
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 self-start sm:self-auto"
          >
            <Link href="/services#doctors" className="gap-1.5">
              <span>{t("সকল ডাক্তারদের তালিকা", "View All Doctors")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* 4-Column Responsive Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => {
            const name = locale === "bn" ? doc.name_bn : doc.name_en;
            const specialization =
              locale === "bn" ? doc.specialization_bn : doc.specialization_en;
            const qualification =
              locale === "bn" ? doc.qualification_bn : doc.qualification_en;
            const institute =
              locale === "bn" ? doc.institute_bn : doc.institute_en;

            return (
              <div
                key={doc.id || doc.name_en}
                className="group flex flex-col justify-between rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Doctor Avatar Header */}
                <div className="relative pt-6 pb-4 bg-muted/40 flex flex-col items-center justify-center border-b">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-background shadow-md bg-white">
                    <Image
                      src={doc.image_path || "/images/doctors/slsh.jpg"}
                      alt={name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      sizes="112px"
                    />
                  </div>

                  {doc.bmdc_number && (
                    <span className="absolute bottom-2 right-3 text-[10px] font-mono font-semibold bg-background/90 text-foreground px-2 py-0.5 rounded border shadow-sm">
                      BMDC: {doc.bmdc_number}
                    </span>
                  )}
                </div>

                {/* Doctor Details */}
                <div className="p-4 flex-1 flex flex-col justify-between text-center space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {name}
                    </h3>

                    <p className="text-xs font-semibold text-primary line-clamp-2 leading-tight">
                      {specialization}
                    </p>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {qualification}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="inline-flex items-center gap-1 max-w-full px-2.5 py-1 rounded-md bg-muted/60 text-[10px] text-muted-foreground truncate border">
                      <Building2 className="h-3 w-3 text-red-600 shrink-0" />
                      <span className="truncate">{institute || "Star Line Hospital"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full text-[11px] h-8 px-2 font-medium"
                      >
                        <Link href="/services#doctors">
                          {t("প্রোফাইল দেখুন", "View Profile")}
                        </Link>
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="rounded-full text-[11px] h-8 px-2 font-medium gap-1"
                      >
                        <Link href="/contact">
                          <CalendarCheck className="h-3 w-3" />
                          <span>{t("সিরিয়াল নিন", "Appointment")}</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
