"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Newspaper, HeartPulse, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { Badge } from "@/components/ui/badge";
import { NewsBlogItemData } from "@/features/settings/api/settings.api";

interface NewsBlogSectionProps {
  blogs?: NewsBlogItemData[];
  news?: NewsBlogItemData[];
}

export function NewsBlogSection({ blogs = [], news = [] }: NewsBlogSectionProps) {
  const { t, locale } = useLanguageStore();

  return (
    <section id="news-blog" className="py-14 sm:py-20 bg-muted/20 border-t">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Health Awareness Blog */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {t("স্বাস্থ্য সচেতনতা ব্লগ", "Health Awareness Blog")}
                </h3>
              </div>

              <Link
                href="/blog"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{t("সকল ব্লগ", "View All")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {blogs.map((b) => {
                const title = locale === "bn" ? b.title_bn : b.title_en;
                const summary = locale === "bn" ? b.summary_bn : b.summary_en;

                return (
                  <div
                    key={b.id || b.slug}
                    className="p-4 rounded-xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span>{b.published_date}</span>
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-primary/5 text-primary border-primary/20">
                        {b.category}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                      <Link href={`/blog/${b.slug || "post"}`}>
                        {title}
                      </Link>
                    </h4>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hospital News & Events */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-sky-600" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {t("সংবাদ ও সাম্প্রতিক কার্যক্রম", "Hospital News & Events")}
                </h3>
              </div>

              <Link
                href="/news"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{t("সকল সংবাদ", "View All")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {news.map((n) => {
                const title = locale === "bn" ? n.title_bn : n.title_en;
                const summary = locale === "bn" ? n.summary_bn : n.summary_en;

                return (
                  <div
                    key={n.id || n.slug}
                    className="p-4 rounded-xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-sky-600" />
                        <span>{n.published_date}</span>
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300">
                        {n.category}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                      <Link href={`/news/${n.slug || "event"}`}>
                        {title}
                      </Link>
                    </h4>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
