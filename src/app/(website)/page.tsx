"use client";

import React from "react";
import { HeroCarousel } from "@/components/website/hero-carousel";
import { QuickActions } from "@/components/website/quick-actions";
import { WelcomeStrip } from "@/components/website/welcome-strip";
import { DepartmentsSection } from "@/components/website/departments-section";
import { DoctorsSection } from "@/components/website/doctors-section";
import { FacilitiesSection } from "@/components/website/facilities-section";
import { PackagesSection } from "@/components/website/packages-section";
import { HealthCardBanner } from "@/components/website/health-card-banner";
import { NewsBlogSection } from "@/components/website/news-blog-section";
import { EmergencyBanner } from "@/components/website/emergency-banner";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";

export default function HomePage() {
  const {
    topbar,
    slides,
    departments,
    doctors,
    facilities,
    packages,
    healthCard,
    blogs,
    news,
  } = useSiteSettings();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Carousel */}
      <section className="relative w-full">
        <HeroCarousel slides={slides} />
      </section>

      {/* 2. Floating Quick Actions (Find Doctor, Appointment, Report) */}
      <QuickActions />

      {/* 3. Welcome Strip & KPI Metrics */}
      <WelcomeStrip />

      {/* 4. Specialized Departments (Medical Care) */}
      <DepartmentsSection departments={departments} />

      {/* 5. Our Specialist Doctors (Medical Team) */}
      <DoctorsSection doctors={doctors} />

      {/* 6. Diagnostic & Clinical Services (Clinical Facilities) */}
      <FacilitiesSection facilities={facilities} />

      {/* 7. Health Checkup Packages (Preventive Health) */}
      <PackagesSection packages={packages} />

      {/* 8. Star Line Health Care Card Facility Banner */}
      <HealthCardBanner cardData={healthCard} />

      {/* 9. Health Awareness Blog & Hospital News */}
      <NewsBlogSection blogs={blogs} news={news} />

      {/* 10. 24/7 Emergency & Hotline Banner */}
      <EmergencyBanner topbar={topbar} />
    </div>
  );
}
