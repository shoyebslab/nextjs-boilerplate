"use client";

import React, { useState } from "react";
import { UserFormData } from "../types/user.types";
import { validateUserForm } from "../schemas/user.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, RoleType } from "@/config/permissions.config";

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || "",
    username: initialData?.username || "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    role: initialData?.role || ROLES.USER,
    department: initialData?.department || "Operations",
    password: "",
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm(formData, isEdit);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="John"
          />
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Doe"
          />
          {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@starline.com"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select
            value={formData.role}
            onValueChange={(val) => setFormData({ ...formData, role: val as RoleType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
              <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
              <SelectItem value={ROLES.MANAGER}>Manager</SelectItem>
              <SelectItem value={ROLES.USER}>Staff User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isEdit && (
        <div className="space-y-1.5">
          <Label htmlFor="password">Temporary Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
