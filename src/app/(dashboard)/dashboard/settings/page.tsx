"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState(siteConfig.name);
  const [apiUrl, setApiUrl] = useState(siteConfig.apiBaseUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="System Settings"
        description="Global environment variables, API endpoints, and platform metadata"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment & Integration Parameters</CardTitle>
          <CardDescription className="text-xs">
            Manage Django REST Framework connectivity and runtime configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Organization Name</Label>
              <Input
                id="s-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-api">DRF Backend API Endpoint</Label>
              <Input
                id="s-api"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Base URL for SimpleJWT token verification and model endpoints.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm">
                {saved ? "Saved Configuration" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
