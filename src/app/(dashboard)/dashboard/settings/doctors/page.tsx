"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stethoscope,
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
  Building2,
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
import { settingsApi, DoctorData } from "@/features/settings/api/settings.api";

const doctorSchema = z.object({
  name_en: z.string().min(1, "Doctor English name is required"),
  name_bn: z.string().min(1, "Doctor Bangla name is required"),
  specialization_en: z.string().min(1, "Specialization (English) is required"),
  specialization_bn: z.string().min(1, "Specialization (Bangla) is required"),
  qualification_en: z.string(),
  qualification_bn: z.string(),
  institute_en: z.string(),
  institute_bn: z.string(),
  bmdc_number: z.string(),
  image_path: z.string().min(1, "Doctor image path is required"),
  department_name: z.string(),
  profile_url: z.string(),
  order: z.number().min(0, "Order must be positive"),
  is_active: z.boolean(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

const DOCTOR_IMAGE_PRESETS = [
  { label: "Prof. Dr. Birendra Nath", path: "/images/doctors/dr-birendra-nath-bhattacharya.jpg" },
  { label: "Prof. Dr. Tahmina Siddika", path: "/images/doctors/prof-dr-tahmina-siddika.jpg" },
  { label: "Prof. Dr. Khorshed Alam", path: "/images/doctors/dr-md-humayun-kabir-bhuiyan.jpg" },
  { label: "Chaiti Bhattacharjee", path: "/images/doctors/chaiti-bhattacharjee.jpg" },
  { label: "Dr. Farrukhhoda Jewel", path: "/images/doctors/dr-asm-badruddoza-jewel.jpg" },
  { label: "Dr. Asish Ahsan", path: "/images/doctors/dr-ashraful-haque.jpg" },
  { label: "Dr. Aminul Islam", path: "/images/doctors/Dr.Aminul-Islam.jpg" },
  { label: "Dr. Asadul Haque", path: "/images/doctors/Dr-Sujit-Kumar-Saha.jpg" },
  { label: "Hospital Badge Logo", path: "/images/doctors/slsh.jpg" },
];

export default function DoctorsSettingsPage() {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DoctorData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name_en: "",
      name_bn: "",
      specialization_en: "",
      specialization_bn: "",
      qualification_en: "",
      qualification_bn: "",
      institute_en: "Star Line Specialized Hospital",
      institute_bn: "স্টার লাইন স্পেশালাইজড হাসপাতাল",
      bmdc_number: "",
      image_path: "/images/doctors/slsh.jpg",
      department_name: "Cardiology",
      profile_url: "",
      order: 1,
      is_active: true,
    },
  });

  const currentImagePath = watch("image_path");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getDoctors();
      setDoctors(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to load doctors:", err);
      setStatusMessage({ type: "error", text: "Could not fetch doctors from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openCreateDialog = () => {
    setEditingDoc(null);
    const nextOrder = doctors.length > 0 ? Math.max(...doctors.map((d) => d.order)) + 1 : 1;
    reset({
      name_en: "",
      name_bn: "",
      specialization_en: "",
      specialization_bn: "",
      qualification_en: "",
      qualification_bn: "",
      institute_en: "Star Line Specialized Hospital",
      institute_bn: "স্টার লাইন স্পেশালাইজড হাসপাতাল",
      bmdc_number: "",
      image_path: "/images/doctors/slsh.jpg",
      department_name: "General Medicine",
      profile_url: "",
      order: nextOrder,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (doc: DoctorData) => {
    setEditingDoc(doc);
    reset({
      name_en: doc.name_en,
      name_bn: doc.name_bn,
      specialization_en: doc.specialization_en,
      specialization_bn: doc.specialization_bn,
      qualification_en: doc.qualification_en || "",
      qualification_bn: doc.qualification_bn || "",
      institute_en: doc.institute_en || "Star Line Specialized Hospital",
      institute_bn: doc.institute_bn || "স্টার লাইন স্পেশালাইজড হাসপাতাল",
      bmdc_number: doc.bmdc_number || "",
      image_path: doc.image_path || "/images/doctors/slsh.jpg",
      department_name: doc.department_name || "",
      profile_url: doc.profile_url || "",
      order: doc.order,
      is_active: doc.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (doc: DoctorData) => {
    if (!doc.id) return;
    try {
      const updated = await settingsApi.updateDoctor(doc.id, {
        is_active: !doc.is_active,
      });
      setDoctors((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, is_active: updated.is_active } : d))
      );
      setStatusMessage({
        type: "success",
        text: `Doctor "${doc.name_en}" is now ${updated.is_active ? "Active" : "Inactive"}.`,
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Toggle active error:", err);
      setStatusMessage({ type: "error", text: "Failed to update doctor status." });
    }
  };

  const onFormSubmit = async (values: DoctorFormValues) => {
    try {
      if (editingDoc && editingDoc.id) {
        const updated = await settingsApi.updateDoctor(editingDoc.id, values);
        setDoctors((prev) =>
          prev
            .map((d) => (d.id === editingDoc.id ? updated : d))
            .sort((a, b) => a.order - b.order)
        );
        setStatusMessage({
          type: "success",
          text: `Doctor profile "${updated.name_en}" updated successfully!`,
        });
      } else {
        const created = await settingsApi.createDoctor(values);
        setDoctors((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setStatusMessage({
          type: "success",
          text: `New doctor profile "${created.name_en}" added!`,
        });
      }
      setIsDialogOpen(false);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Failed to save doctor:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Error saving doctor.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deleteDoctor(deleteTargetId);
      setDoctors((prev) => prev.filter((d) => d.id !== deleteTargetId));
      setStatusMessage({ type: "success", text: "Doctor removed." });
      setDeleteTargetId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Delete error:", err);
      setStatusMessage({ type: "error", text: "Failed to delete doctor profile." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= doctors.length) return;

    const currentItem = doctors[index];
    const targetItem = doctors[targetIndex];

    if (!currentItem.id || !targetItem.id) return;

    try {
      const newCurrentOrder = targetItem.order;
      const newTargetOrder = currentItem.order;

      await Promise.all([
        settingsApi.updateDoctor(currentItem.id, { order: newCurrentOrder }),
        settingsApi.updateDoctor(targetItem.id, { order: newTargetOrder }),
      ]);

      const updatedList = [...doctors];
      updatedList[index] = { ...currentItem, order: newCurrentOrder };
      updatedList[targetIndex] = { ...targetItem, order: newTargetOrder };
      setDoctors(updatedList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Reorder error:", err);
      fetchDoctors();
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
            <span className="text-foreground font-medium">Doctors</span>
          </div>
          <PageHeader
            title="Specialist Doctors Directory"
            description="Manage hospital consultants, BMDC registration, qualifications, avatars, and homepage feature set"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchDoctors}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Doctor
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

      {/* Doctors Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Featured Specialist Doctors ({doctors.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Featured on the homepage under "Our Specialist Doctors"
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {doctors.filter((d) => d.is_active).length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4 w-14">Avatar</th>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">BMDC / Institute</th>
                  <th className="py-3 px-4 w-20 text-center">Active</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No doctors registered yet. Click "Add Doctor" to get started.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc, index) => (
                    <tr
                      key={doc.id || index}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono font-semibold">
                          <span>{doc.order}</span>
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
                              disabled={index === doctors.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-muted">
                          <Image
                            src={doc.image_path || "/images/doctors/slsh.jpg"}
                            alt={doc.name_en}
                            fill
                            className="object-cover object-top"
                            sizes="40px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-xs">{doc.name_bn}</p>
                          <p className="text-muted-foreground text-[11px]">{doc.name_en}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <p className="text-xs font-semibold text-primary line-clamp-1">
                            {doc.specialization_bn || doc.specialization_en}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {doc.qualification_bn || doc.qualification_en}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {doc.bmdc_number && (
                            <span className="font-mono text-[10px] bg-muted/60 px-2 py-0.5 rounded border inline-block">
                              BMDC: {doc.bmdc_number}
                            </span>
                          )}
                          <p className="text-[11px] text-muted-foreground truncate">
                            {doc.institute_en || "Star Line Hospital"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={doc.is_active}
                            onCheckedChange={() => handleToggleActive(doc)}
                            aria-label={`Toggle active for ${doc.name_en}`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(doc)}
                            title="Edit Doctor"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteTargetId(doc.id || null)}
                            title="Delete Doctor"
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

      {/* Add / Edit Dialog using React Hook Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingDoc ? "Edit Doctor Profile" : "Register Specialist Doctor"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure doctor details, credentials, affiliations, and avatar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2" noValidate>
            {/* Quick Image Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Pre-Loaded Doctor Avatar</Label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 rounded-md bg-muted/40 border">
                {DOCTOR_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      setValue("image_path", preset.path, { shouldValidate: true });
                    }}
                    className={`text-[10px] px-2 py-1 rounded transition-colors ${
                      currentImagePath === preset.path
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background border hover:bg-muted text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image_path" className="text-xs font-semibold">
                Image Path *
              </Label>
              <Input
                id="image_path"
                placeholder="/images/doctors/dr-birendra-nath-bhattacharya.jpg"
                {...register("image_path")}
                aria-invalid={errors.image_path ? "true" : "false"}
              />
              {errors.image_path && (
                <p className="text-[11px] text-destructive">{errors.image_path.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name_bn" className="text-xs font-semibold">
                  ডাক্তারের নাম (বাংলা) *
                </Label>
                <Input
                  id="name_bn"
                  placeholder="যেমন: অধ্যাপক ডাঃ বীরেন্দ্র নাথ"
                  {...register("name_bn")}
                  aria-invalid={errors.name_bn ? "true" : "false"}
                />
                {errors.name_bn && (
                  <p className="text-[11px] text-destructive">{errors.name_bn.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name_en" className="text-xs font-semibold">
                  Doctor Name (English) *
                </Label>
                <Input
                  id="name_en"
                  placeholder="e.g. Prof. Dr. Birendra Nath"
                  {...register("name_en")}
                  aria-invalid={errors.name_en ? "true" : "false"}
                />
                {errors.name_en && (
                  <p className="text-[11px] text-destructive">{errors.name_en.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="specialization_bn" className="text-xs font-semibold">
                  বিশেষজ্ঞ পদবী (বাংলা) *
                </Label>
                <Input
                  id="specialization_bn"
                  placeholder="কার্ডিওলজিস্ট ও হৃদরোগ বিশেষজ্ঞ"
                  {...register("specialization_bn")}
                  aria-invalid={errors.specialization_bn ? "true" : "false"}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialization_en" className="text-xs font-semibold">
                  Specialization (English) *
                </Label>
                <Input
                  id="specialization_en"
                  placeholder="Cardiologist & Heart Failure Specialist"
                  {...register("specialization_en")}
                  aria-invalid={errors.specialization_en ? "true" : "false"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qualification_bn" className="text-xs font-semibold">
                  ডিগ্রি / শিক্ষাগত যোগ্যতা (বাংলা)
                </Label>
                <Textarea
                  id="qualification_bn"
                  rows={2}
                  placeholder="এমবিবিএস, এফসিপিএস, পিএইচডি..."
                  {...register("qualification_bn")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qualification_en" className="text-xs font-semibold">
                  Qualifications (English)
                </Label>
                <Textarea
                  id="qualification_en"
                  rows={2}
                  placeholder="MBBS, FCPS, PhD, FACP..."
                  {...register("qualification_en")}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bmdc_number" className="text-xs font-semibold">
                  BMDC Reg. Number
                </Label>
                <Input
                  id="bmdc_number"
                  placeholder="A-18492"
                  {...register("bmdc_number")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="institute_en" className="text-xs font-semibold">
                  Hospital / Institute
                </Label>
                <Input
                  id="institute_en"
                  placeholder="Star Line Specialized Hospital"
                  {...register("institute_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="order" className="text-xs font-semibold">
                  Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
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
                {isSubmitting ? "Saving..." : editingDoc ? "Update Doctor" : "Register Doctor"}
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
            <AlertDialogTitle className="text-base">Delete Doctor Profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove this doctor profile from the website?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Doctor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
