"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
  Tag,
  Flame,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { settingsApi, HealthPackageData } from "@/features/settings/api/settings.api";

const packageSchema = z.object({
  name_en: z.string().min(1, "English package name is required"),
  name_bn: z.string().min(1, "Bangla package name is required"),
  target_audience_en: z.string().min(1, "English target audience is required"),
  target_audience_bn: z.string().min(1, "Bangla target audience is required"),
  original_price: z.number().min(0, "Original price must be >= 0"),
  discounted_price: z.number().min(0, "Discounted price must be >= 0"),
  is_popular: z.boolean(),
  features_text_en: z.string().min(1, "At least one English feature is required"),
  features_text_bn: z.string().min(1, "At least one Bangla feature is required"),
  details_url: z.string(),
  order: z.number().min(0, "Order must be positive"),
  is_active: z.boolean(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function PackagesSettingsPage() {
  const [packages, setPackages] = useState<HealthPackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<HealthPackageData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name_en: "",
      name_bn: "",
      target_audience_en: "Men & Women",
      target_audience_bn: "পুরুষ ও মহিলা",
      original_price: 3000,
      discounted_price: 2200,
      is_popular: false,
      features_text_en: "Complete Blood Count (CBC)\nUrine R/M/E\nFasting Blood Sugar (FBS)\nLipid Profile\nSerum Creatinine",
      features_text_bn: "কমপ্লিট ব্লাড কাউন্ট (সিবিসি)\nইউরিন আর/এম/ই\nফাস্টিং ব্লাড সুগার\nলিপিড প্রোফাইল\nসেরাম ক্রিয়েটিনিন",
      details_url: "/services#packages",
      order: 1,
      is_active: true,
    },
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getPackages();
      setPackages(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to load health packages:", err);
      setStatusMessage({ type: "error", text: "Could not fetch health packages from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateDialog = () => {
    setEditingPackage(null);
    const nextOrder = packages.length > 0 ? Math.max(...packages.map((p) => p.order)) + 1 : 1;
    reset({
      name_en: "",
      name_bn: "",
      target_audience_en: "Men & Women (All Ages)",
      target_audience_bn: "সকল বয়সী পুরুষ ও মহিলা",
      original_price: 3500,
      discounted_price: 2500,
      is_popular: false,
      features_text_en: "Complete Blood Count (CBC)\nUrine R/M/E\nFasting Blood Sugar (FBS)\nLipid Profile\nSerum Creatinine\nDoctor Consultation",
      features_text_bn: "কমপ্লিট ব্লাড কাউন্ট (সিবিসি)\nইউরিন আর/এম/ই\nফাস্টিং ব্লাড সুগার (এফবিএস)\nলিপিড প্রোফাইল\nসেরাম ক্রিয়েটিনিন\nডাক্তার কনসালটেশন",
      details_url: "/services#packages",
      order: nextOrder,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: HealthPackageData) => {
    setEditingPackage(pkg);
    const featuresEn = Array.isArray(pkg.features_list_en) ? pkg.features_list_en.join("\n") : "";
    const featuresBn = Array.isArray(pkg.features_list_bn) ? pkg.features_list_bn.join("\n") : "";

    reset({
      name_en: pkg.name_en,
      name_bn: pkg.name_bn,
      target_audience_en: pkg.target_audience_en,
      target_audience_bn: pkg.target_audience_bn,
      original_price: pkg.original_price,
      discounted_price: pkg.discounted_price,
      is_popular: pkg.is_popular,
      features_text_en: featuresEn,
      features_text_bn: featuresBn,
      details_url: pkg.details_url || "/services#packages",
      order: pkg.order,
      is_active: pkg.is_active,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: PackageFormValues) => {
    try {
      const features_list_en = values.features_text_en
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const features_list_bn = values.features_text_bn
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name_en: values.name_en,
        name_bn: values.name_bn,
        target_audience_en: values.target_audience_en,
        target_audience_bn: values.target_audience_bn,
        original_price: values.original_price,
        discounted_price: values.discounted_price,
        is_popular: values.is_popular,
        features_list_en,
        features_list_bn,
        details_url: values.details_url,
        order: values.order,
        is_active: values.is_active,
      };

      if (editingPackage?.id) {
        await settingsApi.updatePackage(editingPackage.id, payload);
        setStatusMessage({ type: "success", text: `Updated package "${values.name_en}" successfully.` });
      } else {
        await settingsApi.createPackage(payload);
        setStatusMessage({ type: "success", text: `Created package "${values.name_en}" successfully.` });
      }
      setIsDialogOpen(false);
      await fetchPackages();
    } catch (err: any) {
      console.error("Failed to save health package:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Failed to save package. Check server logs.",
      });
    }
  };

  const handleToggleActive = async (pkg: HealthPackageData) => {
    if (!pkg.id) return;
    try {
      await settingsApi.updatePackage(pkg.id, { is_active: !pkg.is_active });
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, is_active: !p.is_active } : p))
      );
      setStatusMessage({
        type: "success",
        text: `Package "${pkg.name_en}" is now ${!pkg.is_active ? "active" : "hidden"}.`,
      });
    } catch (err) {
      console.error("Failed to toggle package status:", err);
      setStatusMessage({ type: "error", text: "Failed to update status." });
    }
  };

  const handleTogglePopular = async (pkg: HealthPackageData) => {
    if (!pkg.id) return;
    try {
      await settingsApi.updatePackage(pkg.id, { is_popular: !pkg.is_popular });
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, is_popular: !p.is_popular } : p))
      );
      setStatusMessage({
        type: "success",
        text: `Package "${pkg.name_en}" popular badge updated.`,
      });
    } catch (err) {
      console.error("Failed to toggle popular status:", err);
      setStatusMessage({ type: "error", text: "Failed to update popular badge." });
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deletePackage(deleteTargetId);
      setStatusMessage({ type: "success", text: "Package deleted successfully." });
      setDeleteTargetId(null);
      await fetchPackages();
    } catch (err) {
      console.error("Failed to delete package:", err);
      setStatusMessage({ type: "error", text: "Failed to delete package." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= packages.length) return;

    const currentPkg = packages[index];
    const targetPkg = packages[targetIndex];

    if (!currentPkg.id || !targetPkg.id) return;

    try {
      const currentOrder = currentPkg.order;
      const targetOrder = targetPkg.order;

      await settingsApi.updatePackage(currentPkg.id, { order: targetOrder });
      await settingsApi.updatePackage(targetPkg.id, { order: currentOrder });

      await fetchPackages();
    } catch (err) {
      console.error("Failed to reorder packages:", err);
      setStatusMessage({ type: "error", text: "Failed to reorder packages." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/dashboard/settings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <PageHeader
            title="Popular Health Checkup Packages"
            description="Manage preventive health packages, discounted pricing, checklist tests, and popular badges"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPackages}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Health Package
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Packages Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Preventive Health Packages ({packages.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Rendered on the public website homepage under "Popular Health Checkup Packages"
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
              <Link href="/#packages" target="_blank">
                <span>View on Website</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">Order</th>
                  <th className="py-2.5 px-4">Package Name (EN / BN)</th>
                  <th className="py-2.5 px-4 hidden md:table-cell">Target Audience</th>
                  <th className="py-2.5 px-4">Pricing</th>
                  <th className="py-2.5 px-4 hidden sm:table-cell text-center">Tests</th>
                  <th className="py-2.5 px-4 text-center">Popular</th>
                  <th className="py-2.5 px-4 w-20 text-center">Status</th>
                  <th className="py-2.5 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading health packages...
                    </td>
                  </tr>
                ) : packages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      No packages found. Click "Add Health Package" above.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg, idx) => (
                    <tr key={pkg.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono font-medium text-foreground w-4 text-center">
                            {pkg.order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === packages.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground text-xs">{pkg.name_en}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{pkg.name_bn}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        <span className="text-[11px]">{pkg.target_audience_en}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1.5">
                          {pkg.original_price > pkg.discounted_price && (
                            <span className="text-[11px] text-muted-foreground line-through font-mono">
                              ৳{pkg.original_price.toLocaleString()}
                            </span>
                          )}
                          <span className="font-bold text-red-600 font-mono text-sm">
                            ৳{pkg.discounted_price.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-center">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {pkg.features_list_en?.length || 0} tests
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(pkg)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            pkg.is_popular
                              ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <Flame className="h-3 w-3" />
                          <span>{pkg.is_popular ? "Popular" : "Standard"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={pkg.is_active}
                            onCheckedChange={() => handleToggleActive(pkg)}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditDialog(pkg)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => pkg.id && setDeleteTargetId(pkg.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Health Package" : "Add Health Package"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure package title, discounted pricing, target demographic, and test checklist items.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Package Name EN & BN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name_en" className="text-xs font-semibold">
                  Package Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name_en"
                  placeholder="e.g. Executive Health Checkup"
                  {...register("name_en")}
                />
                {errors.name_en && (
                  <p className="text-[11px] text-red-500">{errors.name_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name_bn" className="text-xs font-semibold">
                  Package Name (Bangla) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name_bn"
                  placeholder="e.g. এক্সিকিউটিভ হেলথ চেকআপ"
                  {...register("name_bn")}
                />
                {errors.name_bn && (
                  <p className="text-[11px] text-red-500">{errors.name_bn.message}</p>
                )}
              </div>
            </div>

            {/* Target Audience EN & BN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="target_audience_en" className="text-xs font-semibold">
                  Target Audience (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="target_audience_en"
                  placeholder="e.g. For Corporate Professionals"
                  {...register("target_audience_en")}
                />
                {errors.target_audience_en && (
                  <p className="text-[11px] text-red-500">{errors.target_audience_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="target_audience_bn" className="text-xs font-semibold">
                  Target Audience (Bangla) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="target_audience_bn"
                  placeholder="e.g. কর্পোরেট ও কর্মজীবীদের জন্য"
                  {...register("target_audience_bn")}
                />
                {errors.target_audience_bn && (
                  <p className="text-[11px] text-red-500">{errors.target_audience_bn.message}</p>
                )}
              </div>
            </div>

            {/* Pricing: Original and Discounted */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg border bg-muted/20">
              <div className="space-y-1.5">
                <Label htmlFor="original_price" className="text-xs font-semibold">
                  Original Regular Price (৳)
                </Label>
                <Input
                  id="original_price"
                  type="number"
                  placeholder="3500"
                  {...register("original_price", { valueAsNumber: true })}
                />
                {errors.original_price && (
                  <p className="text-[11px] text-red-500">{errors.original_price.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discounted_price" className="text-xs font-semibold text-red-600">
                  Discounted Offer Price (৳) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="discounted_price"
                  type="number"
                  placeholder="2500"
                  {...register("discounted_price", { valueAsNumber: true })}
                />
                {errors.discounted_price && (
                  <p className="text-[11px] text-red-500">{errors.discounted_price.message}</p>
                )}
              </div>
            </div>

            {/* Test Checklist (One per line) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="features_text_en" className="text-xs font-semibold">
                  Test Items List (English) <span className="text-xs font-normal text-muted-foreground">(one per line)</span>
                </Label>
                <Textarea
                  id="features_text_en"
                  rows={5}
                  placeholder="Complete Blood Count (CBC)&#10;Lipid Profile (Cholesterol)&#10;Fasting Blood Sugar&#10;ECG (12 Lead)&#10;Doctor Consultation"
                  {...register("features_text_en")}
                />
                {errors.features_text_en && (
                  <p className="text-[11px] text-red-500">{errors.features_text_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="features_text_bn" className="text-xs font-semibold">
                  Test Items List (Bangla) <span className="text-xs font-normal text-muted-foreground">(এক লাইনে একটি)</span>
                </Label>
                <Textarea
                  id="features_text_bn"
                  rows={5}
                  placeholder="কমপ্লিট ব্লাড কাউন্ট (সিবিসি)&#10;লিপিড প্রোফাইল&#10;ফাস্টিং ব্লাড সুগার&#10;ইসিজি (১২ লিড)&#10;ডাক্তার কনসালটেশন"
                  {...register("features_text_bn")}
                />
                {errors.features_text_bn && (
                  <p className="text-[11px] text-red-500">{errors.features_text_bn.message}</p>
                )}
              </div>
            </div>

            {/* Details URL & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="details_url" className="text-xs font-semibold">
                  Full Details Link URL
                </Label>
                <Input
                  id="details_url"
                  placeholder="/services#packages"
                  {...register("details_url")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="order" className="text-xs font-semibold">
                  Display Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order && (
                  <p className="text-[11px] text-red-500">{errors.order.message}</p>
                )}
              </div>
            </div>

            {/* Popular Badge & Active Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold cursor-pointer">Popular Badge</Label>
                  <p className="text-[11px] text-muted-foreground">Highlight with POPULAR badge</p>
                </div>
                <Controller
                  name="is_popular"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold cursor-pointer">Live on Website</Label>
                  <p className="text-[11px] text-muted-foreground">Active in package carousel/grid</p>
                </div>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                {isSubmitting ? "Saving..." : editingPackage ? "Update Package" : "Create Package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Health Package</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete this health checkup package? This will permanently remove it from the preventive health section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
