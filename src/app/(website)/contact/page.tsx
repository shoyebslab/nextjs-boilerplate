"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-10 space-y-8 max-w-4xl">
      <PageHeader
        title="Contact Our Team"
        description="Reach out to enterprise support or administrative desks"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Direct Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{siteConfig.contact.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{siteConfig.contact.email}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="c-name">Full Name</Label>
                <Input id="c-name" placeholder="Alex Morgan" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" placeholder="alex@company.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-msg">Message</Label>
                <textarea
                  id="c-msg"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="How can our operations team help?"
                />
              </div>
              <Button type="submit" className="w-full text-xs">
                Send Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
