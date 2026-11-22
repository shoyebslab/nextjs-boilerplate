"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { Button } from "@/components/ui/button";
import { HealthCardNoticeData } from "@/features/settings/api/settings.api";

interface HealthCardBannerProps {
  cardData?: HealthCardNoticeData | null;
}

export function HealthCardBanner({ cardData }: HealthCardBannerProps) {
  const { t, locale } = useLanguageStore();

  const badge =
    locale === "bn"
      ? cardData?.badge_text_bn || "বিশেষ ছাড় ও সুবিধা"
      : cardData?.badge_text_en || "Special Discounts & Privileges";
  const title =
    locale === "bn"
      ? cardData?.title_bn || "স্টার লাইন হেলথ কেয়ার কার্ড সুবিধা"
      : cardData?.title_en || "Star Line Health Care Card Facility";
  const subtitle =
    locale === "bn"
      ? cardData?.subtitle_bn ||
        "আমাদের অফিশিয়াল হেলথ কার্ডে ডায়াগনস্টিক টেস্ট, রোগী ভর্তি এবং ওপিডি সেবায় বিশেষ ছাড় উপভোগ করুন।"
      : cardData?.subtitle_en ||
        "Enjoy valuable discounts on diagnostic tests, hospital admissions, and OPD services with our official Health Care Card.";

  return (
    <section className="bg-gradient-to-r from-[#092042] via-[#0b3c6f] to-[#0284c7] text-white py-12 sm:py-16 shadow-inner">
      <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Content */}
        <div className="space-y-2 text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-900 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <span>●</span>
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed pt-1">
            {subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs gap-2 shadow-md h-11 px-6"
          >
            <Link href={cardData?.verify_url || "/contact"}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{t("অনলাইন কার্ড যাচাই", "Verify Card Online")}</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold text-xs h-11 px-6"
          >
            <Link href={cardData?.benefits_url || "/about"}>
              <span>{t("কার্ডের সুবিধা", "Card Benefits")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
