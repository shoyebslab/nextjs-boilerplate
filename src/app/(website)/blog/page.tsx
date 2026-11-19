import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog & Updates",
};

const ARTICLES = [
  {
    slug: "nextjs-15-drf-jwt-refresh-pattern",
    title: "Handling Django REST SimpleJWT Refresh Loops in Next.js 15",
    summary: "How to handle 401 Unauthorized responses with an asynchronous Axios retry queue in modern React.",
    date: "November 2026",
  },
  {
    slug: "dual-theming-css-variables-next-themes",
    title: "Dual Color Palettes with Tailwind CSS Variables",
    summary: "Structuring independent color themes for your website and dashboard without CSS bundle bloat.",
    date: "October 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-10 space-y-8 max-w-4xl">
      <PageHeader
        title="Engineering & Insights Blog"
        description="Articles on full-stack Next.js, DRF security, and frontend architecture"
      />

      <div className="space-y-4">
        {ARTICLES.map((article) => (
          <Card key={article.slug} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <span className="text-[10px] text-muted-foreground uppercase font-mono">{article.date}</span>
              <CardTitle className="text-lg">
                <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                  {article.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-xs">{article.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
