import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";

interface LogoProps {
  className?: string;
  href?: string;
  showText?: boolean;
}

export function Logo({ className, href = "/", showText = true }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Activity className="h-5 w-5" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-foreground leading-none">
            {siteConfig.shortName}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
            Enterprise
          </span>
        </div>
      )}
    </Link>
  );
}
