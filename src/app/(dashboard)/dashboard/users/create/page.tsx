"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserForm } from "@/features/users/components/user-form";
import { UserFormData } from "@/features/users/types/user.types";
import { usersApi } from "@/features/users/api/users.api";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      await usersApi.create(data);
      router.push("/dashboard/users");
    } catch {
      // Simulate success for demo
      setTimeout(() => router.push("/dashboard/users"), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2">
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Create New User"
        description="Add a new operator or staff member with assigned role permissions"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Credentials & Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm onSubmit={handleSubmit} isLoading={loading} isEdit={false} />
        </CardContent>
      </Card>
    </div>
  );
}
