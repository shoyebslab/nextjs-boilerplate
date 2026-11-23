"use client";

import React from "react";
import { Building2, UserPlus, HeartPulse, Microscope, Smile } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";

export function WelcomeStrip() {
  const { t } = useLanguageStore();

  const stats = [
    {
      value: "৬০+",
      valueEn: "60+",
      label: t("বিশেষজ্ঞ চিকিৎসক", "Expert Specialists"),
      icon: UserPlus,
      color: "text-primary",
    },
    {
      value: "২৪/৭",
      valueEn: "24/7",
      label: t("জরুরি সেবা ও আইসিইউ", "Emergency & Critical Care"),
      icon: HeartPulse,
      color: "text-red-500",
    },
    {
      value: "১০০%",
      valueEn: "100%",
      label: t("আন্তর্জাতিক মানের ল্যাব", "Automated Diagnostics"),
      icon: Microscope,
      color: "text-emerald-500",
    },
    {
      value: "১ লক্ষ+",
      valueEn: "100K+",
      label: t("সন্তুষ্ট রোগী ও পরিবার", "Satisfied Patients"),
      icon: Smile,
      color: "text-amber-500",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container max-w-5xl text-center space-y-4">
        {/* Welcome Icon Badge */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0b3c6f] to-sky-600 text-white shadow-lg">
          <Building2 className="h-7 w-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b3c6f] dark:text-sky-300 tracking-tight">
          {t(
            "স্টার লাইন স্পেশালাইজড হাসপাতালে আপনাকে স্বাগতম",
            "Welcome to Star Line Specialized Hospital"
          )}
        </h2>

        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-primary" />

        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {t(
            "আধুনিক বিশেষায়িত স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা",
            "Trusted Destination for Advanced Specialized Healthcare"
          )}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t(
            "আধুনিক প্রযুক্তি • অভিজ্ঞ চিকিৎসক • নির্ভরযোগ্য চিকিৎসা সেবা",
            "Modern technology • Experienced doctors • Reliable medical care"
          )}
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/80">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-card border border-border/60 text-center space-y-1 shadow-sm"
              >
                <Icon className={`h-6 w-6 mx-auto ${s.color}`} />
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {t(s.value, s.valueEn)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
