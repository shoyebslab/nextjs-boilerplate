"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
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
  Stethoscope,
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
import { settingsApi, DepartmentData } from "@/features/settings/api/settings.api";

const departmentSchema = z.object({
  name_en: z.string().min(1, "English department name is required"),
  name_bn: z.string().min(1, "Bangla department name is required"),
  subtitle_en: z.string(),
  subtitle_bn: z.string(),
  description_en: z.string(),
  description_bn: z.string(),
  icon_name: z.string(),
  doctor_count: z.number().min(0, "Doctor count must be positive"),
  dept_url: z.string(),
  order: z.number().min(0, "Order must be positive"),
  is_active: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export default function DepartmentsSettingsPage() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name_en: "",
      name_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      description_en: "",
      description_bn: "",
      icon_name: "Building2",
      doctor_count: 1,
      dept_url: "",
      order: 1,
      is_active: true,
    },
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getDepartments();
      setDepartments(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to load departments:", err);
      setStatusMessage({ type: "error", text: "Could not fetch departments from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateDialog = () => {
    setEditingDept(null);
    const nextOrder = departments.length > 0 ? Math.max(...departments.map((d) => d.order)) + 1 : 1;
    reset({
      name_en: "",
      name_bn: "",
      subtitle_en: "",
      subtitle_bn: "",
      description_en: "",
      description_bn: "",
      icon_name: "Building2",
      doctor_count: 1,
      dept_url: "",
      order: nextOrder,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (dept: DepartmentData) => {
    setEditingDept(dept);
    reset({
      name_en: dept.name_en,
      name_bn: dept.name_bn,
      subtitle_en: dept.subtitle_en || "",
      subtitle_bn: dept.subtitle_bn || "",
      description_en: dept.description_en || "",
      description_bn: dept.description_bn || "",
      icon_name: dept.icon_name || "Building2",
      doctor_count: dept.doctor_count,
      dept_url: dept.dept_url || "",
      order: dept.order,
      is_active: dept.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (dept: DepartmentData) => {
    if (!dept.id) return;
    try {
      const updated = await settingsApi.updateDepartment(dept.id, {
        is_active: !dept.is_active,
      });
      setDepartments((prev) =>
        prev.map((d) => (d.id === dept.id ? { ...d, is_active: updated.is_active } : d))
      );
      setStatusMessage({
        type: "success",
        text: `Department "${dept.name_en}" is now ${updated.is_active ? "Active" : "Inactive"}.`,
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Toggle active error:", err);
      setStatusMessage({ type: "error", text: "Failed to update department status." });
    }
  };

  const onFormSubmit = async (values: DepartmentFormValues) => {
    try {
      if (editingDept && editingDept.id) {
        const updated = await settingsApi.updateDepartment(editingDept.id, values);
        setDepartments((prev) =>
          prev
            .map((d) => (d.id === editingDept.id ? updated : d))
            .sort((a, b) => a.order - b.order)
        );
        setStatusMessage({
          type: "success",
          text: `Department "${updated.name_en}" updated successfully!`,
        });
      } else {
        const created = await settingsApi.createDepartment(values);
        setDepartments((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setStatusMessage({
          type: "success",
          text: `New department "${created.name_en}" added!`,
        });
      }
      setIsDialogOpen(false);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Failed to save department:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Error saving department.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deleteDepartment(deleteTargetId);
      setDepartments((prev) => prev.filter((d) => d.id !== deleteTargetId));
      setStatusMessage({ type: "success", text: "Department removed." });
      setDeleteTargetId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Delete error:", err);
      setStatusMessage({ type: "error", text: "Failed to delete department." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= departments.length) return;

    const currentItem = departments[index];
    const targetItem = departments[targetIndex];

    if (!currentItem.id || !targetItem.id) return;

    try {
      const newCurrentOrder = targetItem.order;
      const newTargetOrder = currentItem.order;

      await Promise.all([
        settingsApi.updateDepartment(currentItem.id, { order: newCurrentOrder }),
        settingsApi.updateDepartment(targetItem.id, { order: newTargetOrder }),
      ]);

      const updatedList = [...departments];
      updatedList[index] = { ...currentItem, order: newCurrentOrder };
      updatedList[targetIndex] = { ...targetItem, order: newTargetOrder };
      setDepartments(updatedList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Reorder error:", err);
      fetchDepartments();
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
            <span className="text-foreground font-medium">Departments</span>
          </div>
          <PageHeader
            title="Specialized Clinical Departments"
            description="Manage hospital departments, bilingual titles, doctor count, descriptions, and homepage visibility"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchDepartments}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Department
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

      {/* Departments Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Active Clinical Departments ({departments.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Featured on the homepage under "Specialized Departments"
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {departments.filter((d) => d.is_active).length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Department (EN)</th>
                  <th className="py-3 px-4">বিভাগ (বাংলা)</th>
                  <th className="py-3 px-4">Doctors</th>
                  <th className="py-3 px-4">Subtitle</th>
                  <th className="py-3 px-4 w-20 text-center">Active</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No departments added yet. Click "Add Department" to get started.
                    </td>
                  </tr>
                ) : (
                  departments.map((dept, index) => (
                    <tr
                      key={dept.id || index}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono font-semibold">
                          <span>{dept.order}</span>
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
                              disabled={index === departments.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {dept.name_en}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">
                        {dept.name_bn}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-[10px] gap-1 font-normal">
                          <Stethoscope className="h-3 w-3 text-primary" />
                          <span>{dept.doctor_count} Doctors</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-muted-foreground text-[11px]">
                        {dept.subtitle_en || dept.subtitle_bn || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={dept.is_active}
                            onCheckedChange={() => handleToggleActive(dept)}
                            aria-label={`Toggle active for ${dept.name_en}`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(dept)}
                            title="Edit Department"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteTargetId(dept.id || null)}
                            title="Delete Department"
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingDept ? "Edit Clinical Department" : "Create Clinical Department"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure bilingual titles, doctor count, and description for this department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name_en" className="text-xs font-semibold">
                  Department Name (English) *
                </Label>
                <Input
                  id="name_en"
                  placeholder="e.g. Cardiology"
                  {...register("name_en")}
                  aria-invalid={errors.name_en ? "true" : "false"}
                />
                {errors.name_en && (
                  <p className="text-[11px] text-destructive">{errors.name_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name_bn" className="text-xs font-semibold">
                  বিভাগের নাম (বাংলা) *
                </Label>
                <Input
                  id="name_bn"
                  placeholder="যেমন: হৃদরোগ বিভাগ"
                  {...register("name_bn")}
                  aria-invalid={errors.name_bn ? "true" : "false"}
                />
                {errors.name_bn && (
                  <p className="text-[11px] text-destructive">{errors.name_bn.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="subtitle_en" className="text-xs font-semibold">
                  Subtitle (English)
                </Label>
                <Input
                  id="subtitle_en"
                  placeholder="Comprehensive clinical cardiac treatment"
                  {...register("subtitle_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subtitle_bn" className="text-xs font-semibold">
                  সাবটাইটেল (বাংলা)
                </Label>
                <Input
                  id="subtitle_bn"
                  placeholder="হৃদরোগ চিকিৎসায় ও নিবিড় পরিচর্যা সেবা"
                  {...register("subtitle_bn")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="description_en" className="text-xs font-semibold">
                  Detailed Description (English)
                </Label>
                <Textarea
                  id="description_en"
                  rows={2}
                  placeholder="Clinical procedures and inpatient facilities..."
                  {...register("description_en")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description_bn" className="text-xs font-semibold">
                  বিস্তারিত বিবরণ (বাংলা)
                </Label>
                <Textarea
                  id="description_bn"
                  rows={2}
                  placeholder="২৪ ঘণ্টা সেবা ও অভিজ্ঞ বিশেষজ্ঞ..."
                  {...register("description_bn")}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="doctor_count" className="text-xs font-semibold">
                  Doctor Count
                </Label>
                <Input
                  id="doctor_count"
                  type="number"
                  {...register("doctor_count", { valueAsNumber: true })}
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dept_url" className="text-xs font-semibold">
                  URL Slug
                </Label>
                <Input
                  id="dept_url"
                  placeholder="cardiology"
                  {...register("dept_url")}
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
                {isSubmitting ? "Saving..." : editingDept ? "Update Department" : "Create Department"}
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
            <AlertDialogTitle className="text-base">Delete Department?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove this department from the website?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
