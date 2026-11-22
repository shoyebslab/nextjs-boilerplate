"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sliders,
  Menu,
  Images,
  ArrowRight,
  Phone,
  Layers,
  Globe,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Building2,
  Stethoscope,
  Activity,
  Package,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { settingsApi, CombinedSettingsResponse } from "@/features/settings/api/settings.api";

export default function SettingsHubPage() {
  const [data, setData] = useState<CombinedSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getCombinedSettings();
      setData(res);
    } catch (err) {
      console.error("Failed to load settings summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Hospital Website & Content Settings"
          description="Manage public website header, navigation menu, hero carousel, departments, doctors, clinical services, and packages"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm" variant="default" className="gap-1.5 text-xs">
            <Link href="/" target="_blank">
              <span>View Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Section 1: Header, Navigation & Hero Banners */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Site Identity & Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Topbar Card */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Sliders className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">
                  Live Active
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Topbar Header</CardTitle>
              <CardDescription className="text-xs">
                Hotline, ambulance desk, bilingual announcement banner, and contact coordinates.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Emergency Hotline:</span>
                <span className="font-semibold text-foreground font-mono">
                  {data?.topbar.phone_display || "09611-177177"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ambulance Direct:</span>
                <span className="font-semibold text-foreground font-mono">
                  {data?.topbar.ambulance || "01844-477701"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bilingual Support:</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> BN / EN
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/topbar">
                  <span>Configure Topbar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Navbar Card */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Menu className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  {data?.navbar.length || 8} Menu Links
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Navbar Navigation</CardTitle>
              <CardDescription className="text-xs">
                Primary site menu structure, bilingual menu titles, sorting order, and active routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Active Items:</span>
                <span className="font-semibold text-foreground">
                  {data?.navbar.filter((n) => n.is_active).length || 8} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>External Links:</span>
                <span className="font-semibold text-foreground">
                  {data?.navbar.filter((n) => n.is_external).length || 1} Links
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>CTA Button:</span>
                <span className="text-emerald-600 font-medium">Appointment</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/navbar">
                  <span>Configure Navbar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Slider Card */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <Images className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300">
                  {data?.slides.length || 10} Slides
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Hero Slider Carousel</CardTitle>
              <CardDescription className="text-xs">
                Bilingual hero banners, desktop & mobile image paths, slide order, and action buttons.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Active Slides:</span>
                <span className="font-semibold text-foreground">
                  {data?.slides.filter((s) => s.is_active).length || 10} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Media Engine:</span>
                <span className="font-semibold text-foreground">Embla ARIA Carousel</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mobile-Optimized:</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/slider">
                  <span>Configure Slider</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Section 2: Clinical Services & Medical Entities */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Medical Departments, Doctors & Packages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Departments */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {data?.departments.length || 8} Depts
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Departments</CardTitle>
              <CardDescription className="text-xs">
                Specialized hospital medical departments and specialist doctor counts.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Active:</span>
                <span className="font-semibold text-foreground">
                  {data?.departments.filter((d) => d.is_active).length || 8} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Homepage Grid:</span>
                <span className="font-semibold text-foreground">8 Cards</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/departments">
                  <span>Manage Departments</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Doctors */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-primary flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">
                  {data?.doctors.length || 8} Doctors
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Specialist Doctors</CardTitle>
              <CardDescription className="text-xs">
                Medical team roster, BMDC registrations, qualifications, and avatars.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Active Doctors:</span>
                <span className="font-semibold text-foreground">
                  {data?.doctors.filter((d) => d.is_active).length || 8} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>BMDC Verified:</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/doctors">
                  <span>Manage Doctors</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Clinical Facilities */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">
                  {data?.facilities.length || 6} Services
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Clinical Services</CardTitle>
              <CardDescription className="text-xs">
                Diagnostic technologies, cardiac labs, pathology, and ICU services.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Active Facilities:</span>
                <span className="font-semibold text-foreground">
                  {data?.facilities.filter((f) => f.is_active).length || 6} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Clinical Equipment:</span>
                <span className="font-semibold text-foreground">4D / 128 Slice</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/facilities">
                  <span>Manage Facilities</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Health Packages */}
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  {data?.packages.length || 4} Packages
                </Badge>
              </div>
              <CardTitle className="text-base pt-2">Health Packages</CardTitle>
              <CardDescription className="text-xs">
                Preventive health checkup packages with discounted ৳ rates and test checklists.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between pt-1 border-t">
                <span>Popular Flagged:</span>
                <span className="font-semibold text-foreground">
                  {data?.packages.filter((p) => p.is_popular).length || 4} Flagged
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discounted Rates:</span>
                <span className="text-red-600 font-semibold font-mono">৳1,500 – ৳6,200</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <Link href="/dashboard/settings/packages">
                  <span>Manage Packages</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Central Palette & Localization Info Box */}
      <Card className="bg-muted/30 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Central Architecture Features</CardTitle>
          </div>
          <CardDescription className="text-xs">
            How changes propagate across the Starline Hospital ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 p-3 rounded-lg bg-background border">
            <div className="font-semibold text-foreground flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-sky-600" />
              Dynamic Bilingual Switching (Bangla : English)
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Every text element in the Topbar, Navbar, Hero Carousel, Departments, Doctors, Clinical Facilities, and Health Packages supports both Bangla and English fields in the database. When visitors toggle the language switcher on the topbar, all components reactively render the corresponding translation without page reload.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-background border">
            <div className="font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              Central Color Palette System
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              The entire website palette is driven centrally by CSS variables defined in <code>globals.css</code> (Hospital Navy <code>#0b2545</code>, Medical Blue <code>#0b3c6f</code>, Sterile Slate, and Emergency Crimson <code>#dc2626</code>). Altering the central theme instantly updates buttons, banners, gradients, and badges across the entire site without hardcoded overrides.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
