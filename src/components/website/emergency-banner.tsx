"use client";

import React from "react";
import { Phone, Siren, Clock } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { TopbarData } from "@/features/settings/api/settings.api";

interface EmergencyBannerProps {
  topbar?: TopbarData;
}

export function EmergencyBanner({ topbar }: EmergencyBannerProps) {
  const { t } = useLanguageStore();

  const hotline = topbar?.hotline || "+8809611177177";
  const phoneDisplay = topbar?.phone_display || "+8809611177177";
  const ambulance = topbar?.ambulance || "01844-477701";

  return (
    <section className="bg-gradient-to-r from-[#0b2545] via-[#0b3c6f] to-[#0284c7] text-white py-10 shadow-inner">
      <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 text-red-300 px-3 py-1 text-xs font-bold border border-red-500/30">
            <Clock className="h-3.5 w-3.5" />
            <span>{t("সার্বক্ষণিক ২৪ ঘণ্টা জরুরি সেবা", "24/7 Round-The-Clock Emergency")}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            {t("জরুরি চিকিৎসায় আমাদের সরাসরি কল করুন", "Need Immediate Care? Call Our Emergency Desk")}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            {t(
              "জরুরি রোগী ভর্তি, আইসিইউ বেড এবং দ্রুত অ্যাম্বুলেন্স পেতে হটলাইনে যোগাযোগ করুন।",
              "Immediate ambulance dispatch, ICU admission, and emergency specialist on call."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${hotline}`}
            className="flex items-center gap-2.5 rounded-xl bg-white text-[#0b3c6f] px-5 py-3 font-extrabold shadow-lg hover:bg-sky-50 transition-all text-sm"
          >
            <Phone className="h-4 w-4 text-sky-600" />
            <span>{phoneDisplay}</span>
          </a>

          <a
            href={`tel:${ambulance}`}
            className="flex items-center gap-2.5 rounded-xl bg-red-600 text-white px-5 py-3 font-extrabold shadow-lg hover:bg-red-700 transition-all text-sm animate-pulse"
          >
            <Siren className="h-4 w-4" />
            <span>{ambulance}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
