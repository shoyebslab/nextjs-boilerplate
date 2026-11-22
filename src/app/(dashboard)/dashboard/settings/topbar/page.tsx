"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sliders,
  ArrowLeft,
  Save,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { settingsApi, TopbarData } from "@/features/settings/api/settings.api";
import { DEFAULT_TOPBAR } from "@/features/settings/hooks/use-site-settings";

const topbarSchema = z.object({
  phone_display: z.string().min(1, "Hotline display text is required"),
  hotline: z.string().min(1, "Dialable telephone number is required"),
  ambulance: z.string().min(1, "Ambulance contact number is required"),
  email: z.string().email("Valid hospital email is required"),
  announcement_bn: z.string(),
  announcement_en: z.string(),
  address_bn: z.string(),
  address_en: z.string(),
  facebook_url: z.string(),
  youtube_url: z.string(),
  portal_link: z.string(),
});

type TopbarFormValues = z.infer<typeof topbarSchema>;

export default function TopbarSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TopbarFormValues>({
    resolver: zodResolver(topbarSchema),
    defaultValues: DEFAULT_TOPBAR,
  });

  // Watch fields for live preview updates
  const watchedEmail = watch("email") || DEFAULT_TOPBAR.email;
  const watchedAmbulance = watch("ambulance") || DEFAULT_TOPBAR.ambulance;
  const watchedPhoneDisplay = watch("phone_display") || DEFAULT_TOPBAR.phone_display;

  const fetchTopbar = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getTopbar();
      reset({
        phone_display: data.phone_display,
        hotline: data.hotline,
        ambulance: data.ambulance,
        email: data.email,
        announcement_bn: data.announcement_bn || "",
        announcement_en: data.announcement_en || "",
        address_bn: data.address_bn || "",
        address_en: data.address_en || "",
        facebook_url: data.facebook_url || "",
        youtube_url: data.youtube_url || "",
        portal_link: data.portal_link || "/login",
      });
    } catch (err: any) {
      console.error("Failed to load topbar settings:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load settings from backend. Displaying defaults.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopbar();
  }, []);

  const onSubmit = async (values: TopbarFormValues) => {
    try {
      setStatusMessage(null);
      const updated = await settingsApi.updateTopbar(values);
      reset(values);
      setStatusMessage({
        type: "success",
        text: "Topbar settings updated successfully! Public website reflects changes immediately.",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error("Failed to save topbar:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Failed to save topbar settings. Please check your network.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard/settings" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Settings Hub
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Topbar</span>
          </div>
          <PageHeader
            title="Topbar Settings"
            description="Control emergency contact numbers, ambulance alert, bilingual announcement, and address"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchTopbar}
            disabled={loading || isSubmitting}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Reload
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href="/" target="_blank">
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-lg border text-xs font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:text-emerald-300"
              : "bg-red-500/10 text-red-800 border-red-500/30 dark:text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Live Visual Preview */}
      <Card className="border-border bg-card overflow-hidden shadow-sm">
        <CardHeader className="py-2.5 px-4 bg-muted/40 border-b">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-primary" /> Live Topbar Preview
            </span>
            <Badge variant="outline" className="text-[10px] bg-background">
              Client View
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-[#0b2545] text-slate-100 text-[11px] px-4 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sky-300 font-medium">
                <Mail className="h-3 w-3" /> {watchedEmail}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                🚑 Ambulance: {watchedAmbulance}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <Phone className="h-3 w-3" /> {watchedPhoneDisplay}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-sky-200">
                বাংলা | EN
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* React Hook Form Configuration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Contact Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Emergency & Telephone Contacts
            </CardTitle>
            <CardDescription className="text-xs">
              Direct hotlines rendered in the header and click-to-call mobile buttons
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone_display" className="text-xs font-semibold">
                Hotline Display Text *
              </Label>
              <Input
                id="phone_display"
                placeholder="+8809611177177"
                {...register("phone_display")}
                aria-invalid={errors.phone_display ? "true" : "false"}
              />
              {errors.phone_display && (
                <p className="text-[11px] text-destructive">{errors.phone_display.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">Visible format shown to users on topbar.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hotline" className="text-xs font-semibold">
                Dialable Telephone URI *
              </Label>
              <Input
                id="hotline"
                placeholder="+8809611177177"
                {...register("hotline")}
                aria-invalid={errors.hotline ? "true" : "false"}
              />
              {errors.hotline && (
                <p className="text-[11px] text-destructive">{errors.hotline.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">International dialable format for <code>tel:</code> link.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ambulance" className="text-xs font-semibold">
                Ambulance Emergency Hotline *
              </Label>
              <Input
                id="ambulance"
                placeholder="01844-477701"
                {...register("ambulance")}
                aria-invalid={errors.ambulance ? "true" : "false"}
              />
              {errors.ambulance && (
                <p className="text-[11px] text-destructive">{errors.ambulance.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">Direct mobile contact for round-the-clock ambulance dispatch.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Official Support Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info@starlinehospital.com.bd"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">Hospital public communications mailbox.</p>
            </div>
          </CardContent>
        </Card>

        {/* Bilingual Announcement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              Bilingual Announcement Banner
            </CardTitle>
            <CardDescription className="text-xs">
              Special ticker notification displayed across the hospital website
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="announcement_bn" className="text-xs font-semibold flex items-center justify-between">
                <span>ঘোষণা বার্তা (বাংলা)</span>
                <Badge variant="outline" className="text-[10px]">Bangla</Badge>
              </Label>
              <Input
                id="announcement_bn"
                placeholder="জরুরি বিভাগ ও সার্বক্ষণিক অ্যাম্বুলেন্স সেবা ২৪ ঘণ্টা খোলা"
                {...register("announcement_bn")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="announcement_en" className="text-xs font-semibold flex items-center justify-between">
                <span>Announcement Message (English)</span>
                <Badge variant="outline" className="text-[10px]">English</Badge>
              </Label>
              <Input
                id="announcement_en"
                placeholder="Emergency Department & Ambulance Services Available 24/7"
                {...register("announcement_en")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bilingual Hospital Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Physical Hospital Address
            </CardTitle>
            <CardDescription className="text-xs">
              Displayed in contact sections and website footer
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="address_bn" className="text-xs font-semibold flex items-center justify-between">
                <span>ঠিকানা (বাংলা)</span>
                <Badge variant="outline" className="text-[10px]">Bangla</Badge>
              </Label>
              <Textarea
                id="address_bn"
                rows={3}
                placeholder="মহিপাল, ঢাকা-চট্টগ্রাম মহাসড়ক সংলগ্ন, ফেনী"
                {...register("address_bn")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address_en" className="text-xs font-semibold flex items-center justify-between">
                <span>Physical Address (English)</span>
                <Badge variant="outline" className="text-[10px]">English</Badge>
              </Label>
              <Textarea
                id="address_en"
                rows={3}
                placeholder="Near Mahipal, Dhaka-Chittagong Highway, Feni, Bangladesh"
                {...register("address_en")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={fetchTopbar}
            disabled={isSubmitting || loading}
          >
            Reset Form
          </Button>
          <Button type="submit" disabled={isSubmitting || loading} className="gap-2">
            <Save className={`h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
            {isSubmitting ? "Saving Changes..." : "Save Topbar Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
