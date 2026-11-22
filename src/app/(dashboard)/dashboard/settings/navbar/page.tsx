"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Menu,
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
  Link as LinkIcon,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { settingsApi, NavbarItemData } from "@/features/settings/api/settings.api";
import { DEFAULT_NAVBAR } from "@/features/settings/hooks/use-site-settings";

const navbarItemSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_bn: z.string().min(1, "Bangla title is required"),
  href: z.string().min(1, "Destination Link is required"),
  order: z.number().min(0, "Order must be a non-negative number"),
  is_external: z.boolean(),
  is_button: z.boolean(),
  is_active: z.boolean(),
});

type NavbarItemFormValues = z.infer<typeof navbarItemSchema>;

export default function NavbarSettingsPage() {
  const [items, setItems] = useState<NavbarItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavbarItemData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NavbarItemFormValues>({
    resolver: zodResolver(navbarItemSchema),
    defaultValues: {
      title_en: "",
      title_bn: "",
      href: "/",
      order: 1,
      is_external: false,
      is_button: false,
      is_active: true,
    },
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getNavbarItems();
      setItems(data.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      console.error("Failed to load navbar items:", err);
      setItems(DEFAULT_NAVBAR);
      setStatusMessage({
        type: "error",
        text: "Could not fetch items from backend. Displaying default navigation set.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    reset({
      title_en: "",
      title_bn: "",
      href: "/",
      order: nextOrder,
      is_external: false,
      is_button: false,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: NavbarItemData) => {
    setEditingItem(item);
    reset({
      title_en: item.title_en,
      title_bn: item.title_bn,
      href: item.href,
      order: item.order,
      is_external: item.is_external,
      is_button: item.is_button || false,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (item: NavbarItemData) => {
    if (!item.id) return;
    try {
      const updated = await settingsApi.updateNavbarItem(item.id, {
        is_active: !item.is_active,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: updated.is_active } : i))
      );
      setStatusMessage({
        type: "success",
        text: `Menu item "${item.title_en}" is now ${updated.is_active ? "Active" : "Inactive"}.`,
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Toggle active error:", err);
      setStatusMessage({ type: "error", text: "Failed to update item status." });
    }
  };

  const onFormSubmit = async (values: NavbarItemFormValues) => {
    try {
      if (editingItem && editingItem.id) {
        const updated = await settingsApi.updateNavbarItem(editingItem.id, values);
        setItems((prev) =>
          prev
            .map((i) => (i.id === editingItem.id ? updated : i))
            .sort((a, b) => a.order - b.order)
        );
        setStatusMessage({
          type: "success",
          text: `Menu item "${updated.title_en}" updated successfully!`,
        });
      } else {
        const created = await settingsApi.createNavbarItem(values);
        setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setStatusMessage({
          type: "success",
          text: `New menu item "${created.title_en}" created!`,
        });
      }
      setIsDialogOpen(false);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Failed to save navbar item:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.detail || "Error saving navigation item.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await settingsApi.deleteNavbarItem(deleteTargetId);
      setItems((prev) => prev.filter((i) => i.id !== deleteTargetId));
      setStatusMessage({ type: "success", text: "Navigation item removed." });
      setDeleteTargetId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error("Delete error:", err);
      setStatusMessage({ type: "error", text: "Failed to delete navigation item." });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    if (!currentItem.id || !targetItem.id) return;

    try {
      const newCurrentOrder = targetItem.order;
      const newTargetOrder = currentItem.order;

      await Promise.all([
        settingsApi.updateNavbarItem(currentItem.id, { order: newCurrentOrder }),
        settingsApi.updateNavbarItem(targetItem.id, { order: newTargetOrder }),
      ]);

      const updatedList = [...items];
      updatedList[index] = { ...currentItem, order: newCurrentOrder };
      updatedList[targetIndex] = { ...targetItem, order: newTargetOrder };
      setItems(updatedList.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Reorder error:", err);
      fetchItems();
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
            <span className="text-foreground font-medium">Navbar</span>
          </div>
          <PageHeader
            title="Navbar Menu Settings"
            description="Manage site navigation links, bilingual titles, sorting order, and active visibility"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchItems}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Menu Item
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

      {/* Navigation Items List Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Menu className="h-4 w-4 text-primary" />
                Active Header Navigation Set ({items.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Items appear on the main website navigation bar ordered from left to right
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {items.filter((i) => i.is_active).length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Title (English)</th>
                  <th className="py-3 px-4">Title (বাংলা)</th>
                  <th className="py-3 px-4">Destination Link</th>
                  <th className="py-3 px-4 w-28 text-center">Type</th>
                  <th className="py-3 px-4 w-24 text-center">Status</th>
                  <th className="py-3 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No navigation links configured yet. Click "Add Menu Item" to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono font-semibold">
                          <span>{item.order}</span>
                          <div className="flex flex-col ml-1">
                            <button
                              type="button"
                              onClick={() => handleMove(index, "up")}
                              disabled={index === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Left/Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, "down")}
                              disabled={index === items.length - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                              title="Move Right/Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {item.title_en}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">
                        {item.title_bn}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded text-foreground inline-flex items-center gap-1">
                          {item.is_external ? (
                            <ExternalLink className="h-3 w-3 text-sky-600" />
                          ) : (
                            <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                          {item.href}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.is_button ? (
                          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                            CTA Button
                          </Badge>
                        ) : item.is_external ? (
                          <Badge variant="outline" className="text-[10px] text-sky-700 border-sky-300">
                            External
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Internal
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={() => handleToggleActive(item)}
                            aria-label={`Toggle active for ${item.title_en}`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(item)}
                            title="Edit Item"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteTargetId(item.id || null)}
                            title="Delete Item"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingItem ? "Edit Navigation Link" : "Create New Navigation Link"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure the bilingual title and link destination for this header item.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="title_en" className="text-xs font-semibold">
                  English Title *
                </Label>
                <Input
                  id="title_en"
                  placeholder="e.g. Services"
                  {...register("title_en")}
                  aria-invalid={errors.title_en ? "true" : "false"}
                />
                {errors.title_en && (
                  <p className="text-[11px] text-destructive">{errors.title_en.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title_bn" className="text-xs font-semibold">
                  বাংলা নাম *
                </Label>
                <Input
                  id="title_bn"
                  placeholder="যেমন: সেবাসমূহ"
                  {...register("title_bn")}
                  aria-invalid={errors.title_bn ? "true" : "false"}
                />
                {errors.title_bn && (
                  <p className="text-[11px] text-destructive">{errors.title_bn.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="href" className="text-xs font-semibold">
                Destination Link / URL *
              </Label>
              <Input
                id="href"
                placeholder="e.g. /services or https://report.starlinehospital.com.bd"
                {...register("href")}
                aria-invalid={errors.href ? "true" : "false"}
              />
              {errors.href && (
                <p className="text-[11px] text-destructive">{errors.href.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="order" className="text-xs font-semibold">
                  Display Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  aria-invalid={errors.order ? "true" : "false"}
                />
                {errors.order && (
                  <p className="text-[11px] text-destructive">{errors.order.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold block">Attributes</Label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_external")}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span>External Link (opens new tab)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_button")}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span>Styled as Button CTA</span>
                  </label>
                </div>
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
                {isSubmitting ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
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
            <AlertDialogTitle className="text-base">Delete Navigation Link?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove this navigation item? It will be immediately removed from the live website header.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
