"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Captcha } from "@/components/ui/captcha";
import { useAuth } from "../hooks/use-auth";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required."),
  password: z.string().min(4, "Password must be at least 4 characters long."),
  captcha: z.string().min(1, "Captcha code is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function createCaptchaChallenge() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();
  const [captchaChallenge, setCaptchaChallenge] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      captcha: "",
    },
  });

  useEffect(() => {
    setCaptchaChallenge(createCaptchaChallenge());
  }, []);

  const refreshCaptcha = () => {
    const nextCode = createCaptchaChallenge();
    setCaptchaChallenge(nextCode);
    setValue("captcha", "");
  };

  const handleFillAdmin = () => {
    setValue("identifier", "admin", { shouldValidate: true });
    setValue("password", "admin123", { shouldValidate: true });
    setValue("captcha", captchaChallenge, { shouldValidate: true });
    setServerError(null);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    // Validate captcha challenge
    if (data.captcha.trim().toUpperCase() !== captchaChallenge) {
      setError("captcha", {
        type: "manual",
        message: "The captcha is incorrect.",
      });
      refreshCaptcha();
      return;
    }

    try {
      await login({
        email: data.identifier,
        username: data.identifier,
        password: data.password,
      });
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message ||
        "Failed to sign in. Please check your credentials.";
      setServerError(errorMsg);
      refreshCaptcha();
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Staff Portal Sign In
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your authorized credentials to access Starline Hospital Console
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Quick Autofill Helper */}
      <div className="rounded-lg border bg-muted/30 p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Demo Admin: <strong>admin</strong> / <strong>admin123</strong></span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillAdmin}
          className="h-7 px-2.5 text-[11px] font-medium"
        >
          Auto Fill
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Email or Username */}
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Email or Username</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              placeholder="admin or email@example.com"
              {...register("identifier")}
              className="pl-9"
              aria-invalid={errors.identifier ? "true" : "false"}
            />
          </div>
          {errors.identifier && (
            <p className="text-[11px] text-destructive">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="pl-9"
              aria-invalid={errors.password ? "true" : "false"}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Controlled Captcha Component */}
        <Controller
          name="captcha"
          control={control}
          render={({ field }) => (
            <Captcha
              value={field.value}
              challenge={captchaChallenge}
              onChange={(val) => field.onChange(val)}
              onRefresh={refreshCaptcha}
              error={errors.captcha?.message}
            />
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
        </Button>
      </form>
    </div>
  );
}
