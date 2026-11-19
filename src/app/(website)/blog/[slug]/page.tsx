import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-3 text-muted-foreground">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>
      </Button>

      <div className="space-y-3 border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">{formattedTitle}</h1>
        <p className="text-xs text-muted-foreground">Published in Technical Architecture Guide</p>
      </div>

      <div className="prose dark:prose-invert text-sm text-muted-foreground space-y-4 leading-relaxed">
        <p>
          In an enterprise environment combining Django REST Framework on the backend and Next.js 15 on the frontend,
          coordinating JWT token refresh is critical to user experience.
        </p>
        <p>
          By establishing a centralized Axios interceptor with a failed-request queue, multiple asynchronous component
          calls that return 401 simultaneously will pause, refresh the SimpleJWT access token once, and then replay
          transparently without logging out the operator.
        </p>
      </div>
    </div>
  );
}
