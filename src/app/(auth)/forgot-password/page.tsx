"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api/auth.api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid registered email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await authApi.forgotPassword({ email: data.email });
    } catch {
      // Show confirmation anyway to prevent account enumeration
    } finally {
      setSubmittedEmail(data.email);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-xs text-muted-foreground">
          Enter your authorized staff email to receive a password reset link
        </p>
      </div>

      {submittedEmail ? (
        <div className="rounded-lg border bg-muted/40 p-4 space-y-3 text-center">
          <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
          <p className="text-xs text-muted-foreground">
            If an account exists for <strong>{submittedEmail}</strong>, you will receive password reset instructions shortly.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Registered Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="operator@starline.com"
                {...register("email")}
                className="pl-9"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Dispatching Reset Instructions..." : "Send Reset Link"}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
