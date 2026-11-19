"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/use-auth";
import { validateLogin } from "../schemas/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await login({ email, username: email, password });
      router.push(redirect);
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message ||
        "Failed to sign in. Please check your credentials.";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@12345");
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-xs text-muted-foreground">
          Enter your DRF account credentials to access your dashboard
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email or Username</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="text"
              placeholder="admin@starline.com"
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

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Authenticating..." : "Sign In"}
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground">
          Quick Demo Autofill:
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAutofill("admin@starline.com")}
            className="text-[11px] h-7 flex-1"
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAutofill("manager@starline.com")}
            className="text-[11px] h-7 flex-1"
          >
            Manager
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAutofill("user@starline.com")}
            className="text-[11px] h-7 flex-1"
          >
            Staff User
          </Button>
        </div>
      </div>
    </div>
  );
}
