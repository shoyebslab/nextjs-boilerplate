"use client";

import { useEffect, useState, useCallback } from "react";
import {
  settingsApi,
  CombinedSettingsResponse,
  TopbarData,
  NavbarItemData,
  SliderSlideData,
  DepartmentData,
  DoctorData,
  ClinicalFacilityData,
  HealthPackageData,
  HealthCardNoticeData,
  NewsBlogItemData,
} from "../api/settings.api";

export const DEFAULT_TOPBAR: TopbarData = {
  hotline: "+8809611177177",
  phone_display: "09611-177177",
  ambulance: "01844-477701",
  email: "info@starlinehospital.com.bd",
  address_bn: "মহিপাল, ঢাকা-চট্টগ্রাম মহাসড়ক সংলগ্ন, ফেনী",
  address_en: "Near Mahipal, Dhaka-Chittagong Highway, Feni, Bangladesh",
  announcement_bn: "জরুরি বিভাগ ও সার্বক্ষণিক অ্যাম্বুলেন্স সেবা ২৪ ঘণ্টা খোলা",
  announcement_en: "Emergency Department & Ambulance Services Available 24/7",
  portal_link: "/login",
};

export const DEFAULT_NAVBAR: NavbarItemData[] = [
  { id: 1, title_bn: "হোম", title_en: "Home", href: "/", order: 1, is_active: true, is_external: false },
  { id: 2, title_bn: "আমাদের সম্পর্কে", title_en: "About Us", href: "/about", order: 2, is_active: true, is_external: false },
  { id: 3, title_bn: "স্বাস্থ্য পরীক্ষা", title_en: "Health Packages", href: "#packages", order: 3, is_active: true, is_external: false },
  { id: 4, title_bn: "অভিজ্ঞ চিকিৎসকগণ", title_en: "Our Doctors", href: "#doctors", order: 4, is_active: true, is_external: false },
  { id: 5, title_bn: "বিভাগসমূহ", title_en: "Departments", href: "#departments", order: 5, is_active: true, is_external: false },
  { id: 6, title_bn: "সেবাসমূহ", title_en: "Services", href: "#services", order: 6, is_active: true, is_external: false },
  { id: 7, title_bn: "অনলাইন রিপোর্ট", title_en: "Online Report", href: "https://report.starlinehospital.com.bd", order: 7, is_active: true, is_external: true },
  { id: 8, title_bn: "যোগাযোগ", title_en: "Contact", href: "/contact", order: 8, is_active: true, is_external: false },
];

export const DEFAULT_SLIDES: SliderSlideData[] = [
  {
    id: 1,
    desktop_image: "/images/carousel/desktop/star-line-specialized-hospital.jpg",
    mobile_image: "/images/carousel/mobile/star-line-specialized-hospital.jpg",
    title_bn: "স্টার লাইন স্পেশালাইজড হাসপাতাল",
    title_en: "Star Line Specialized Hospital",
    subtitle_bn: "আধুনিক বিশেষায়িত স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা - ফেনীর মহিপালে আন্তর্জাতিক মানের সেবা",
    subtitle_en: "Trusted Destination for Advanced Healthcare in Mahipal, Feni",
    button_text_bn: "অ্যাপয়েন্টমেন্ট নিন",
    button_text_en: "Book Appointment",
    button_link: "/contact",
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    desktop_image: "/images/carousel/desktop/govt-appvd-a-category-hospital.jpg",
    mobile_image: "/images/carousel/mobile/govt-appvd-a-category-hospital.jpg",
    title_bn: "সরকারি অনুমোদিত \"এ\" ক্যাটাগরি হাসপাতাল",
    title_en: "Govt Approved \"A\" Category Hospital",
    subtitle_bn: "স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় কর্তৃক অনুমোদিত সর্বাধুনিক সুযোগ-সুবিধা সম্বলিত হাসপাতাল",
    subtitle_en: "Ministry of Health & Family Welfare Approved Full-Fledged Modern Hospital",
    button_text_bn: "আমাদের সেবা",
    button_text_en: "Our Services",
    button_link: "#services",
    order: 2,
    is_active: true,
  },
];

export function useSiteSettings() {
  const [topbar, setTopbar] = useState<TopbarData>(DEFAULT_TOPBAR);
  const [navbar, setNavbar] = useState<NavbarItemData[]>(DEFAULT_NAVBAR);
  const [slides, setSlides] = useState<SliderSlideData[]>(DEFAULT_SLIDES);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [facilities, setFacilities] = useState<ClinicalFacilityData[]>([]);
  const [packages, setPackages] = useState<HealthPackageData[]>([]);
  const [healthCard, setHealthCard] = useState<HealthCardNoticeData | null>(null);
  const [blogs, setBlogs] = useState<NewsBlogItemData[]>([]);
  const [news, setNews] = useState<NewsBlogItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res: CombinedSettingsResponse = await settingsApi.getCombinedSettings();
      if (res.topbar) setTopbar(res.topbar);
      if (res.navbar && res.navbar.length > 0) setNavbar(res.navbar);
      if (res.slides && res.slides.length > 0) setSlides(res.slides);
      if (res.departments) setDepartments(res.departments);
      if (res.doctors) setDoctors(res.doctors);
      if (res.facilities) setFacilities(res.facilities);
      if (res.packages) setPackages(res.packages);
      if (res.health_card) setHealthCard(res.health_card);
      if (res.blogs) setBlogs(res.blogs);
      if (res.news) setNews(res.news);
    } catch (err) {
      console.warn("Unable to fetch live site settings from API, using defaults:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    topbar,
    navbar,
    slides,
    departments,
    doctors,
    facilities,
    packages,
    healthCard,
    blogs,
    news,
    loading,
    refresh: fetchSettings,
  };
}
