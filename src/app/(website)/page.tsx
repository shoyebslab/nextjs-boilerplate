import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container flex flex-col items-center text-center space-y-6 max-w-4xl">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary bg-primary/5">
            Enterprise Architecture Blueprint
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Next.js 15 Frontend +{" "}
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              Django REST
            </span>{" "}
            Dashboard
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Production-grade modular architecture featuring separate public and dashboard color themes,
            JWT authentication with automated token refresh, RBAC middleware, and AG Grid data telemetry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="shadow-md gap-2">
              <Link href="/dashboard">
                <span>Enter Dashboard Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Staff Portal Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16 bg-muted/20 border-t">
        <div className="container space-y-10 max-w-6xl">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Architectural Pillars</h2>
            <p className="text-xs text-muted-foreground">Built to scale for high-traffic public sites and dense data portals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Database className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Centered DRF Axios Client</CardTitle>
                <CardDescription className="text-xs">
                  Automated JWT injection, 401 interceptor retry queue, and error mapping.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Auto-refresh on expiration</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Single endpoint catalog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Role-Based Access (RBAC)</CardTitle>
                <CardDescription className="text-xs">
                  Multi-tier role evaluation via Next.js Edge Middleware and UI guards.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Edge route validation</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Dynamic role-filtered menus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Scoped Dual Themes</CardTitle>
                <CardDescription className="text-xs">
                  Independent color palettes for Frontend (Emerald) vs Dashboard (Indigo).
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Next-themes Dark/Light mode</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> AG Grid Quartz theme sync</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
