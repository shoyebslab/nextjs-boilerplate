"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Activity,
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
  HeartPulse,
  Scan,
  Siren,
  FlaskConical,
  Brain,
  Stethoscope,
  Microscope,
  Eye,
  ShieldCheck,
  LucideIcon,
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
import { settingsApi, ClinicalFacilityData } from "@/features/settings/api/settings.api";

const FACILITY_ICON_OPTIONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "HeartPulse", label: "Heart / Cardiac", icon: HeartPulse },
  { name: "Scan", label: "Scanner / Radiology", icon: Scan },
  { name: "Siren", label: "Emergency / Ambulance", icon: Siren },
  { name: "Activity", label: "ICU / Monitoring", icon: Activity },
  { name: "FlaskConical", label: "Laboratory / Pathology", icon: FlaskConical },
  { name: "Brain", label: "Neuro / Surgery", icon: Brain },
  { name: "Stethoscope", label: "General Clinical", icon: Stethoscope },
  { name: "Microscope", label: "Microbiology / Research", icon: Microscope },
  { name: "Eye", label: "Ophthalmology / Vision", icon: Eye },
  { name: "ShieldCheck", label: "Critical Care / Safety", icon: ShieldCheck },
];

const facilitySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_bn: z.string().min(1, "Bangla title is required"),
  subtitle_en: z.string(),
  subtitle_bn: z.string(),
  description_en: z.string(),
  description_bn: z.string(),
  icon_name: z.string().min(1, "Icon selection is required"),
  read_more_url: z.string(),
  order: z.number().min(0, "Order must be positive"),
  is_active: z.boolean(),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

export default function FacilitiesSettingsPage() {
  const [facilities, setFacilities] = useState<ClinicalFacilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<ClinicalFacilityData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      title_en: "",
      title_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      description_en: "",
      description_bn: "",
      icon_name: "Activity",
      read_more_url: "/services",
      order: 1,
      is_active: true,
    },
  });

  const selectedIcon = watch("icon_name");

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getFacilities();
      setFacilities(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to load clinical facilities:", err);
      setStatusMessage({ type: "error", text: "Could not fetch facilities from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openCreateDialog = () => {
    setEditingFacility(null);
    const nextOrder = facilities.length > 0 ? Math.max(...facilities.map((f) => f.order)) + 1 : 1;
    reset({
      title_en: "",
      title_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      description_en: "",
      description_bn: "",
      icon_name: "Activity",
      read_more_url: "/services",
      order: nextOrder,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (facility: ClinicalFacilityData) => {
    setEditingFacility(facility);
    reset({
      title_en: facility.title_en,
      title_bn: facility.title_bn,
      subtitle_en: facility.subtitle_en || "",
      subtitle_bn: facility.subtitle_bn || "",
      description_en: facility.description_en || "",
      description_bn: facility.description_bn || "",
      icon_name: facility.icon_name || "Activity",
      read_more_url: facility.read_more_url || "/services",
      order: facility.order,
      is_active: facility.is_active,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: FacilityFormValues) => {
    try {
      if (editingFacility?.id) {
        await settingsApi.updateFacility(editingFacility.id, values);
        setStatusMessage({ type: "success", text: `Updated facility "${values.title_en}" successfully.` });
      } else {
        await settingsApi.createFacility(values);
        setStatusMessage({ type: "success", text: `Created facility "${values.title_en}" successfully.` });
      }
      setIsDialogOpen(false);
      await fetchFacilities();
    } catch (err: any) {
      console.error("Failed to save facility:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Failed to save facility. Check server logs.",
      });
    }
  };

  const handleToggleActive = async (facility: ClinicalFacilityData) => {
    if (!facility.id) return;
    try {
      await settingsApi.updateFacility(facility.id, { is_active: !facility.is_active });
      setFacilities((prev) =>
        prev.map((f) => (f.id === facility.id ? { ...f, is_active: !f.is_active } : f))
      );
      setStatusMessage({
        type: "success",
        text: `Facility "${facility.title_en}" is now ${!facility.is_active ? "active" : "hidden"}.`,
      });
    } catch (err) {
      console.error("Failed to toggle facility status:", err);
      setStatusMessage({ type: "error", text: "Failed to update status." });
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deleteFacility(deleteTargetId);
      setStatusMessage({ type: "success", text: "Facility deleted successfully." });
      setDeleteTargetId(null);
      await fetchFacilities();
    } catch (err) {
      console.error("Failed to delete facility:", err);
      setStatusMessage({ type: "error", text: "Failed to delete facility." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= facilities.length) return;

    const currentFacility = facilities[index];
    const targetFacility = facilities[targetIndex];

    if (!currentFacility.id || !targetFacility.id) return;

    try {
      const currentOrder = currentFacility.order;
      const targetOrder = targetFacility.order;

      await settingsApi.updateFacility(currentFacility.id, { order: targetOrder });
      await settingsApi.updateFacility(targetFacility.id, { order: currentOrder });

      await fetchFacilities();
    } catch (err) {
      console.error("Failed to reorder facilities:", err);
      setStatusMessage({ type: "error", text: "Failed to reorder facilities." });
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = FACILITY_ICON_OPTIONS.find((item) => item.name === iconName);
    const IconComponent = found ? found.icon : Activity;
    return <IconComponent className="h-5 w-5 text-primary" />;
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
            title="Clinical Facilities & Diagnostic Services"
            description="Manage clinical services grid, equipment capabilities, descriptions, and action links"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFacilities}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Clinical Facility
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

      {/* Facilities Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Hospital Clinical Facilities ({facilities.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Clinical services rendered on the homepage under "Diagnostic & Clinical Services"
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
              <Link href="/#services" target="_blank">
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
                  <th className="py-2.5 px-3 w-14 text-center">Icon</th>
                  <th className="py-2.5 px-4">Title (English / Bangla)</th>
                  <th className="py-2.5 px-4 hidden md:table-cell">Subtitle / Tech</th>
                  <th className="py-2.5 px-4 hidden lg:table-cell">Read More URL</th>
                  <th className="py-2.5 px-4 w-24 text-center">Status</th>
                  <th className="py-2.5 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading clinical facilities...
                    </td>
                  </tr>
                ) : facilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      No clinical facilities configured yet. Click "Add Clinical Facility" above.
                    </td>
                  </tr>
                ) : (
                  facilities.map((fac, idx) => (
                    <tr key={fac.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono font-medium text-foreground w-4 text-center">
                            {fac.order}
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
                              disabled={idx === facilities.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 mx-auto flex items-center justify-center">
                          {getIconComponent(fac.icon_name)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground text-xs">{fac.title_en}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{fac.title_bn}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        <span className="text-[11px] font-medium text-sky-800 dark:text-sky-300">
                          {fac.subtitle_en || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground font-mono text-[11px]">
                        {fac.read_more_url || "/services"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={fac.is_active}
                            onCheckedChange={() => handleToggleActive(fac)}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditDialog(fac)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => fac.id && setDeleteTargetId(fac.id)}
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
              {editingFacility ? "Edit Clinical Facility" : "Add New Clinical Facility"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure bilingual service titles, technical capabilities, icon, and redirection URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title EN & BN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_en" className="text-xs font-semibold">
                  Title (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_en"
                  placeholder="e.g. Cardiac Tests & Heart Care"
                  {...register("title_en")}
                />
                {errors.title_en && (
                  <p className="text-[11px] text-red-500">{errors.title_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title_bn" className="text-xs font-semibold">
                  Title (Bangla) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_bn"
                  placeholder="e.g. কার্ডিয়াক পরীক্ষা ও হার্ট কেয়ার"
                  {...register("title_bn")}
                />
                {errors.title_bn && (
                  <p className="text-[11px] text-red-500">{errors.title_bn.message}</p>
                )}
              </div>
            </div>

            {/* Subtitle EN & BN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="subtitle_en" className="text-xs font-semibold">
                  Subtitle / Machine (English)
                </Label>
                <Input
                  id="subtitle_en"
                  placeholder="e.g. ECG, Echo, ETT, Holter Monitor"
                  {...register("subtitle_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subtitle_bn" className="text-xs font-semibold">
                  Subtitle / Machine (Bangla)
                </Label>
                <Input
                  id="subtitle_bn"
                  placeholder="e.g. ইসিজি, ইকো, ইটিটি, হোল্টার মনিটর"
                  {...register("subtitle_bn")}
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Clinical Facility Icon <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FACILITY_ICON_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = selectedIcon === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setValue("icon_name", item.name)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-[10px] leading-tight">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description EN & BN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="description_en" className="text-xs font-semibold">
                  Description (English)
                </Label>
                <Textarea
                  id="description_en"
                  rows={3}
                  placeholder="Comprehensive diagnostic cardiology with automated digital ECG..."
                  {...register("description_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description_bn" className="text-xs font-semibold">
                  Description (Bangla)
                </Label>
                <Textarea
                  id="description_bn"
                  rows={3}
                  placeholder="কম্প্রিহেনসিভ ডায়াগনস্টিক কার্ডিওলজি ও অটোমেটেড ডিজিটাল ইসিজি..."
                  {...register("description_bn")}
                />
              </div>
            </div>

            {/* Read More URL & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="read_more_url" className="text-xs font-semibold">
                  Details / Service Link URL
                </Label>
                <Input
                  id="read_more_url"
                  placeholder="/services/cardiac"
                  {...register("read_more_url")}
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

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold cursor-pointer">Live on Website</Label>
                <p className="text-[11px] text-muted-foreground">
                  Toggle whether this facility appears on the public website homepage
                </p>
              </div>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
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
                {isSubmitting ? "Saving..." : editingFacility ? "Update Facility" : "Create Facility"}
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
            <AlertDialogTitle>Delete Clinical Facility</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete this clinical facility? This will remove it from the homepage diagnostic services grid.
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
