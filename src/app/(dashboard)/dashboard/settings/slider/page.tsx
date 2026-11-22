"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Images,
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
  Eye,
  Save,
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
import { HeroCarousel } from "@/components/website/hero-carousel";
import { settingsApi, SliderSlideData } from "@/features/settings/api/settings.api";
import { DEFAULT_SLIDES } from "@/features/settings/hooks/use-site-settings";

const sliderSlideSchema = z.object({
  desktop_image: z.string().min(1, "Desktop image path is required"),
  mobile_image: z.string(),
  title_en: z.string().min(1, "English title is required"),
  title_bn: z.string().min(1, "Bangla title is required"),
  subtitle_en: z.string(),
  subtitle_bn: z.string(),
  button_text_en: z.string(),
  button_text_bn: z.string(),
  button_link: z.string(),
  order: z.number().min(0, "Order must be a non-negative number"),
  is_active: z.boolean(),
});

type SliderSlideFormValues = z.infer<typeof sliderSlideSchema>;

const IMAGE_PRESETS = [
  { label: "Starline Specialized Hospital", path: "/images/carousel/desktop/star-line-specialized-hospital.jpg" },
  { label: "Govt Approved A-Category", path: "/images/carousel/desktop/govt-appvd-a-category-hospital.jpg" },
  { label: "Advanced Cath Lab & Cardiology", path: "/images/carousel/desktop/carousel-1.jpg" },
  { label: "Intensive Care Unit (ICU)", path: "/images/carousel/desktop/carousel-2.jpg" },
  { label: "Laparoscopic Modular OT", path: "/images/carousel/desktop/carousel-3.jpg" },
  { label: "High-Resolution MRI & CT Scan", path: "/images/carousel/desktop/carousel-4.jpg" },
  { label: "Neonatal & Pediatric Care (NICU)", path: "/images/carousel/desktop/carousel-5.jpg" },
  { label: "Emergency & Trauma Care 24/7", path: "/images/carousel/desktop/carousel-6.jpg" },
  { label: "Central Diagnostic Laboratory", path: "/images/carousel/desktop/carousel-7.jpg" },
  { label: "Dialysis Unit & Nephrology", path: "/images/carousel/desktop/carousel-8.jpg" },
  { label: "Executive Health Checkup", path: "/images/carousel/desktop/carousel-9.jpg" },
];

export default function SliderSettingsPage() {
  const [slides, setSlides] = useState<SliderSlideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SliderSlideData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SliderSlideFormValues>({
    resolver: zodResolver(sliderSlideSchema),
    defaultValues: {
      desktop_image: "/images/carousel/desktop/carousel-1.jpg",
      mobile_image: "/images/carousel/mobile/carousel-1.jpg",
      title_en: "",
      title_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      button_text_en: "Learn More",
      button_text_bn: "বিস্তারিত দেখুন",
      button_link: "/services",
      order: 1,
      is_active: true,
    },
  });

  const currentDesktopImage = watch("desktop_image");

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getSlides();
      setSlides(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to fetch slides:", err);
      setSlides(DEFAULT_SLIDES);
      setStatusMessage({
        type: "error",
        text: "Could not load slides from backend. Using default dataset.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateDialog = () => {
    setEditingSlide(null);
    const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.order)) + 1 : 1;
    reset({
      desktop_image: "/images/carousel/desktop/carousel-1.jpg",
      mobile_image: "/images/carousel/mobile/carousel-1.jpg",
      title_en: "",
      title_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      button_text_en: "Learn More",
      button_text_bn: "বিস্তারিত দেখুন",
      button_link: "/services",
      order: nextOrder,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (slide: SliderSlideData) => {
    setEditingSlide(slide);
    reset({
      desktop_image: slide.desktop_image,
      mobile_image: slide.mobile_image || slide.desktop_image,
      title_en: slide.title_en,
      title_bn: slide.title_bn,
      subtitle_en: slide.subtitle_en || "",
      subtitle_bn: slide.subtitle_bn || "",
      button_text_en: slide.button_text_en || "Learn More",
      button_text_bn: slide.button_text_bn || "বিস্তারিত দেখুন",
      button_link: slide.button_link || "/services",
      order: slide.order,
      is_active: slide.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (slide: SliderSlideData) => {
    if (!slide.id) return;
    try {
      const updated = await settingsApi.updateSlide(slide.id, {
        is_active: !slide.is_active,
      });
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: updated.is_active } : s))
      );
      setStatusMessage({
        type: "success",
        text: `Slide #${slide.order} is now ${updated.is_active ? "Active" : "Inactive"}.`,
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Toggle active slide error:", err);
      setStatusMessage({ type: "error", text: "Failed to update slide status." });
    }
  };

  const onFormSubmit = async (values: SliderSlideFormValues) => {
    try {
      if (editingSlide && editingSlide.id) {
        const updated = await settingsApi.updateSlide(editingSlide.id, values);
        setSlides((prev) =>
          prev
            .map((s) => (s.id === editingSlide.id ? updated : s))
            .sort((a, b) => a.order - b.order)
        );
        setStatusMessage({
          type: "success",
          text: `Slide "${updated.title_en}" updated successfully!`,
        });
      } else {
        const created = await settingsApi.createSlide(values);
        setSlides((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setStatusMessage({
          type: "success",
          text: `New slide "${created.title_en}" added to carousel!`,
        });
      }
      setIsDialogOpen(false);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Failed to save slide:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Error saving slide.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deleteSlide(deleteTargetId);
      setSlides((prev) => prev.filter((s) => s.id !== deleteTargetId));
      setStatusMessage({ type: "success", text: "Slide removed from carousel." });
      setDeleteTargetId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Delete slide error:", err);
      setStatusMessage({ type: "error", text: "Failed to delete slide." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const currentSlide = slides[index];
    const targetSlide = slides[targetIndex];

    if (!currentSlide.id || !targetSlide.id) return;

    try {
      const newCurrentOrder = targetSlide.order;
      const newTargetOrder = currentSlide.order;

      await Promise.all([
        settingsApi.updateSlide(currentSlide.id, { order: newCurrentOrder }),
        settingsApi.updateSlide(targetSlide.id, { order: newTargetOrder }),
      ]);

      const updatedList = [...slides];
      updatedList[index] = { ...currentSlide, order: newCurrentOrder };
      updatedList[targetIndex] = { ...targetSlide, order: newTargetOrder };
      setSlides(updatedList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Reorder slide error:", err);
      fetchSlides();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard/settings" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Settings Hub
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Slider</span>
          </div>
          <PageHeader
            title="Hero Slider Carousel Settings"
            description="Manage hospital hero slides, desktop/mobile imagery, bilingual titles, and call-to-action buttons"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="gap-1.5 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            {showLivePreview ? "Hide Preview" : "Live Preview"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSlides}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Slide
          </Button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Optional Live Carousel Preview */}
      {showLivePreview && (
        <Card className="overflow-hidden border-border shadow-md">
          <CardHeader className="py-2.5 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5 text-primary" /> Live Carousel Preview ({slides.filter(s => s.is_active).length} Active Slides)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLivePreview(false)}
              className="h-6 text-[11px] px-2"
            >
              Close Preview
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <HeroCarousel slides={slides} />
          </CardContent>
        </Card>
      )}

      {/* Slides Grid / Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Images className="h-4 w-4 text-primary" />
                Hospital Carousel Slides ({slides.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Slides rotate automatically on the home page with ARIA accessible navigation
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {slides.filter((s) => s.is_active).length} Active / {slides.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4 w-28">Preview</th>
                  <th className="py-3 px-4">Title (English & বাংলা)</th>
                  <th className="py-3 px-4">Subtitle</th>
                  <th className="py-3 px-4 w-32">Action Button</th>
                  <th className="py-3 px-4 w-20 text-center">Active</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slides.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No slides created yet. Click "Add Slide" to add your first banner.
                    </td>
                  </tr>
                ) : (
                  slides.map((slide, index) => (
                    <tr
                      key={slide.id || index}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono font-semibold">
                          <span>{slide.order}</span>
                          <div className="flex flex-col ml-1">
                            <button
                              type="button"
                              onClick={() => handleMove(index, "up")}
                              disabled={index === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, "down")}
                              disabled={index === slides.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative w-24 h-14 rounded-md overflow-hidden bg-slate-900 border">
                          <Image
                            src={slide.desktop_image}
                            alt={slide.title_en}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-xs">{slide.title_en}</p>
                          <p className="text-muted-foreground text-[11px]">{slide.title_bn}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-muted-foreground text-[11px]">
                        {slide.subtitle_en || slide.subtitle_bn || "—"}
                      </td>
                      <td className="py-3 px-4">
                        {slide.button_link ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-medium text-foreground">
                              {slide.button_text_en}
                            </span>
                            <span className="block font-mono text-[10px] text-muted-foreground truncate">
                              {slide.button_link}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={slide.is_active}
                            onCheckedChange={() => handleToggleActive(slide)}
                            aria-label={`Toggle active for slide ${slide.title_en}`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(slide)}
                            title="Edit Slide"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteTargetId(slide.id || null)}
                            title="Delete Slide"
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

      {/* Add / Edit Slide Dialog using React Hook Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingSlide ? "Edit Carousel Slide" : "Create New Carousel Slide"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure slide imagery, bilingual titles, and action button destination.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2" noValidate>
            {/* Quick Image Presets */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Choose From Pre-Loaded Hospital Images</Label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-md bg-muted/40 border">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      setValue("desktop_image", preset.path, { shouldValidate: true });
                      setValue("mobile_image", preset.path.replace("/desktop/", "/mobile/"), { shouldValidate: true });
                    }}
                    className={`text-[10px] px-2 py-1 rounded transition-colors ${
                      currentDesktopImage === preset.path
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background border hover:bg-muted text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="desktop_image" className="text-xs font-semibold">
                  Desktop Image Path *
                </Label>
                <Input
                  id="desktop_image"
                  placeholder="/images/carousel/desktop/carousel-1.jpg"
                  {...register("desktop_image")}
                  aria-invalid={errors.desktop_image ? "true" : "false"}
                />
                {errors.desktop_image && (
                  <p className="text-[11px] text-destructive">{errors.desktop_image.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile_image" className="text-xs font-semibold">
                  Mobile Image Path
                </Label>
                <Input
                  id="mobile_image"
                  placeholder="/images/carousel/mobile/carousel-1.jpg"
                  {...register("mobile_image")}
                />
              </div>
            </div>

            {/* Bilingual Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="title_en" className="text-xs font-semibold">
                  Slide Title (English) *
                </Label>
                <Input
                  id="title_en"
                  placeholder="e.g. Modern Cath Lab & Cardiology"
                  {...register("title_en")}
                  aria-invalid={errors.title_en ? "true" : "false"}
                />
                {errors.title_en && (
                  <p className="text-[11px] text-destructive">{errors.title_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title_bn" className="text-xs font-semibold">
                  স্লাইড শিরোনাম (বাংলা) *
                </Label>
                <Input
                  id="title_bn"
                  placeholder="যেমন: আধুনিক ক্যাথ ল্যাব ও হৃদরোগ সেবা"
                  {...register("title_bn")}
                  aria-invalid={errors.title_bn ? "true" : "false"}
                />
                {errors.title_bn && (
                  <p className="text-[11px] text-destructive">{errors.title_bn.message}</p>
                )}
              </div>
            </div>

            {/* Bilingual Subtitles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="subtitle_en" className="text-xs font-semibold">
                  Subtitle (English)
                </Label>
                <Textarea
                  id="subtitle_en"
                  rows={2}
                  placeholder="Comprehensive coronary angiography and cardiac care"
                  {...register("subtitle_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subtitle_bn" className="text-xs font-semibold">
                  সাবটাইটেল (বাংলা)
                </Label>
                <Textarea
                  id="subtitle_bn"
                  rows={2}
                  placeholder="২৪ ঘণ্টা দক্ষ ইন্টারভেনশনাল কার্ডিওলজিস্ট ও জরুরি সেবা"
                  {...register("subtitle_bn")}
                />
              </div>
            </div>

            {/* Button Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="btn_en" className="text-xs font-semibold">
                  Button Text (EN)
                </Label>
                <Input
                  id="btn_en"
                  placeholder="Explore More"
                  {...register("button_text_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="btn_bn" className="text-xs font-semibold">
                  বাটন টেক্সট (বাংলা)
                </Label>
                <Input
                  id="btn_bn"
                  placeholder="বিস্তারিত দেখুন"
                  {...register("button_text_bn")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="btn_link" className="text-xs font-semibold">
                  Button Link
                </Label>
                <Input
                  id="btn_link"
                  placeholder="/services"
                  {...register("button_link")}
                />
              </div>
            </div>

            {/* Order & Active */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-3">
                <Label htmlFor="order" className="text-xs font-semibold">
                  Order:
                </Label>
                <Input
                  id="order"
                  type="number"
                  className="w-20"
                  {...register("order", { valueAsNumber: true })}
                  aria-invalid={errors.order ? "true" : "false"}
                />
                {errors.order && (
                  <p className="text-[11px] text-destructive">{errors.order.message}</p>
                )}
              </div>

              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span>Active on Public Website</span>
                  </label>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
                <Save className={`h-3.5 w-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                {isSubmitting ? "Saving..." : editingSlide ? "Update Slide" : "Add Slide"}
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
            <AlertDialogTitle className="text-base">Delete Carousel Slide?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove this slide from the hospital hero carousel? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Slide
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
