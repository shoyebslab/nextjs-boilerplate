import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="text-xs text-muted-foreground max-w-sm">
        The requested resource or page could not be located on this server.
      </p>
      <Button asChild size="sm">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
