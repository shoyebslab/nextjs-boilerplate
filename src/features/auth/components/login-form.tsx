"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Captcha } from "@/components/ui/captcha";
import { useAuth } from "../hooks/use-auth";
import { validateLogin } from "../schemas/auth.schema";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setCaptchaChallenge(createCaptchaChallenge());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha("");
    setCaptchaChallenge(createCaptchaChallenge());
    setErrors((current) => ({ ...current, captcha: "" }));
  };

  const handleFillAdmin = () => {
    setEmail("admin");
    setPassword("admin123");
    setCaptcha(captchaChallenge);
    setErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateLogin({ email, password });
    const captchaErrors = { ...validation.errors };

    if (!captcha.trim()) {
      captchaErrors.captcha = "Captcha is required.";
    } else if (captcha.trim().toUpperCase() !== captchaChallenge) {
      captchaErrors.captcha = "The captcha is incorrect.";
    }

    if (Object.keys(captchaErrors).length > 0) {
      setErrors(captchaErrors);
      if (captchaErrors.captcha === "The captcha is incorrect.") {
        refreshCaptcha();
      }
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await login({ email, username: email, password });
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message ||
        "Failed to sign in. Please check your credentials.";
      setServerError(errorMsg);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">One step ahead to login</h1>
        <p className="text-xs text-muted-foreground">
          Enter your account credentials to access your dashboard
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Quick Demo Autofill Helper */}
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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email or Username</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="text"
              placeholder="admin or email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-destructive">{errors.email}</p>
          )}
        </div>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password}</p>
          )}
        </div>

        <Captcha
          value={captcha}
          challenge={captchaChallenge}
          onChange={(value) => {
            setCaptcha(value);
            setErrors((current) => ({ ...current, captcha: "" }));
          }}
          onRefresh={refreshCaptcha}
          error={errors.captcha}
        />

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Authenticating..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
