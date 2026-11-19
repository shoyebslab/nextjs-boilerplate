import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site.config";

export function WebsiteFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise digital architecture powered by Django REST Framework and Next.js 15 App Router.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Solutions</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">Clinical Services</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Admin Dashboard</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Engineering Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Desk</Link></li>
              <li><Link href="/login" className="hover:text-primary">Staff Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <p className="text-xs text-muted-foreground">Direct Desk: {siteConfig.contact.phone}</p>
            <p className="text-xs text-muted-foreground">Email: {siteConfig.contact.email}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline text-primary font-medium">Dashboard Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
