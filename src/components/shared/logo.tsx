"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/language.store";

interface LogoProps {
  className?: string;
  href?: string;
  showText?: boolean;
}

export function Logo({ className, href = "/", showText = true }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguageStore();

  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      {!imgError ? (
        <div className="relative h-11 w-44 sm:h-12 sm:w-48 transition-transform group-hover:scale-[1.02]">
          <Image
            src="/logo/hospital-logo1.png"
            alt="Star Line Hospital Logo"
            fill
            className="object-contain object-left"
            priority
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          {showText && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground leading-tight">
                {t("স্টার লাইন হাসপাতাল", "Star Line Hospital")}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {t("স্পেশালাইজড হেলথকেয়ার", "Specialized Healthcare")}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
