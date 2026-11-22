"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, CalendarDays, FileText, ChevronRight } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";

export function QuickActions() {
  const { t } = useLanguageStore();

  const cards = [
    {
      title: t("অভিজ্ঞ চিকিৎসক খুঁজুন", "Find A Doctor"),
      desc: t("৬০+ বিশেষজ্ঞ চিকিৎসকের বিস্তারিত তালিকা ও সময়সূচি", "Directory of over 60 specialist consultants"),
      href: "/services#doctors",
      icon: UserCheck,
      isExternal: false,
    },
    {
      title: t("অনলাইন অ্যাপয়েন্টমেন্ট", "Request An Appointment"),
      desc: t("সহজে আপনার পছন্দের ডাক্তারের সাথে সিরিয়াল বুক করুন", "Book your preferred doctor serial with ease"),
      href: "/contact",
      icon: CalendarDays,
      isExternal: false,
    },
    {
      title: t("অনলাইন রিপোর্ট ডাউনলোড", "Online Diagnostic Report"),
      desc: t("ল্যাবরেটরি ও রেডিওলোজি টেস্টের রিপোর্ট ডিজিটাল পান", "Access your lab & imaging reports securely online"),
      href: "https://report.starlinehospital.com.bd",
      icon: FileText,
      isExternal: true,
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-10 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={c.href}
              target={c.isExternal ? "_blank" : undefined}
              rel={c.isExternal ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-lg hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3c6f] to-sky-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Icon className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#0b3c6f] dark:text-sky-300 group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {c.desc}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-primary shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
