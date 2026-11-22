"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Siren, Mail, MapPin, Facebook, Youtube, ShieldAlert } from "lucide-react";
import { useLanguageStore } from "@/stores/language.store";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";

export function WebsiteFooter() {
  const { t, locale } = useLanguageStore();
  const { topbar } = useSiteSettings();

  const hotline = topbar?.hotline || "+8809611177177";
  const phoneDisplay = topbar?.phone_display || "+8809611177177";
  const ambulance = topbar?.ambulance || "01844-477701";
  const email = topbar?.email || "info@starlinehospital.com.bd";
  const address =
    locale === "bn"
      ? topbar?.address_bn || "মহিপাল, ঢাকা-চট্টগ্রাম মহাসড়ক সংলগ্ন, ফেনী"
      : topbar?.address_en || "Near Mahipal, Dhaka-Chittagong Highway, Feni, Bangladesh";

  return (
    <footer className="bg-[#0b1727] text-slate-200 pt-14 pb-8 border-t border-slate-800">
      <div className="container max-w-6xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Hospital */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-lg p-1 shrink-0 overflow-hidden shadow-sm">
                <Image
                  src="/logo/hospital-logo1.png"
                  alt="Star Line Hospital Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white tracking-tight">
                  {t("স্টার লাইন স্পেশালাইজড হাসপাতাল", "Star Line Specialized Hospital")}
                </h4>
                <p className="text-[10px] text-sky-400 font-medium">
                  {t("পরম মমতায় স্বাস্থ্য সেবা", "Compassionate Healthcare with Excellence")}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                "ফেনী ও বৃহত্তর নোয়াখালী অঞ্চলের সর্বাধুনিক প্রযুক্তি ও বিশ্বমানের চিকিৎসা সেবায় নিবেদিত পূর্ণাঙ্গ মাল্টি-ডিসিপ্লিনারি হাসপাতাল। আমাদের লক্ষ্য ২৪/৭ বিশেষজ্ঞ চিকিৎসা ও বিশ্বস্ত স্বাস্থ্যসেবা নিশ্চিত করা।",
                "A leading multi-disciplinary hospital in Feni and Greater Noakhali region, delivering international-standard medical care with advanced technology, experienced specialists, and 24/7 emergency support."
              )}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={topbar?.facebook_url || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-600 transition-colors"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={topbar?.youtube_url || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                title="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={`tel:${hotline}`}
                className="h-8 w-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                title="Call Emergency Hotline"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              {t("প্রয়োজনীয় লিংক", "Quick Links")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  {t("আমাদের সম্পর্কে", "About Us")}
                </Link>
              </li>
              <li>
                <Link href="/services#doctors" className="hover:text-sky-400 transition-colors">
                  {t("চিকিৎসকবৃন্দ", "Our Doctors")}
                </Link>
              </li>
              <li>
                <Link href="/services#departments" className="hover:text-sky-400 transition-colors">
                  {t("বিভাগসমূহ", "Departments")}
                </Link>
              </li>
              <li>
                <Link href="/services#packages" className="hover:text-sky-400 transition-colors">
                  {t("স্বাস্থ্য পরীক্ষা প্যাকেজ", "Health Checkup Packages")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  {t("ক্লিনিক্যাল সেবাসমূহ", "Clinical Services")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  {t("যোগাযোগ ও সিরিয়াল", "Contact & Appointments")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialized Departments */}
          <div className="space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              {t("বিশেষায়িত বিভাগসমূহ", "Specialized Departments")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/services#cardiology" className="hover:text-sky-400 transition-colors">
                  {t("কার্ডিওলজি (হৃদরোগ বিভাগ)", "Cardiology")}
                </Link>
              </li>
              <li>
                <Link href="/services#cardiac-vascular-surgery" className="hover:text-sky-400 transition-colors">
                  {t("কার্ডিয়াক ভাস্কুলার সার্জারি", "Cardiac Vascular Surgery")}
                </Link>
              </li>
              <li>
                <Link href="/services#child-development" className="hover:text-sky-400 transition-colors">
                  {t("চাইল্ড ডেভেলপমেন্ট সেন্টার", "Child Development Center")}
                </Link>
              </li>
              <li>
                <Link href="/services#cancer-care" className="hover:text-sky-400 transition-colors">
                  {t("ক্যান্সার কেয়ার ও অনকোলজি", "Cancer Care & Oncology")}
                </Link>
              </li>
              <li>
                <Link href="/services#clinical-hematology" className="hover:text-sky-400 transition-colors">
                  {t("ক্লিনিক্যাল হেমাটোলজি", "Clinical Hematology")}
                </Link>
              </li>
              <li>
                <Link href="/services#anesthesiology" className="hover:text-sky-400 transition-colors">
                  {t("অ্যানেস্থেসিওলজি ও আইসিইউ", "Anesthesiology & ICU")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              {t("জরুরি যোগাযোগ", "Emergency Contact")}
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-slate-300 font-semibold">{t("হটলাইন:", "Hotline:")} </span>
                  <a href={`tel:${hotline}`} className="text-white font-bold hover:underline">
                    {phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Siren className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-300 font-semibold">{t("অ্যাম্বুলেন্স:", "Ambulance:")} </span>
                  <a href={`tel:${ambulance}`} className="text-white font-bold hover:underline">
                    {ambulance}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="text-white hover:underline truncate">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-400">Star Line Specialized Hospital</strong>. {t("সর্বস্বত্ব সংরক্ষিত।", "All rights reserved.")}
          </p>

          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              {t("গোপনীয়তা নীতি", "Privacy Policy")}
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              {t("রিফান্ড নীতি", "Refund Policy")}
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              {t("দাবিত্যাগ", "Disclaimer")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
