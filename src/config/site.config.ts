export const siteConfig = {
  name: "Starline Health & Cloud Enterprise",
  shortName: "Starline",
  description: "Next.js 15 + DRF Full Stack Enterprise Website and Clinical Management Dashboard",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  links: {
    dashboard: "/dashboard",
    login: "/login",
    docs: "/docs",
  },
  contact: {
    email: "contact@starline.com",
    phone: "+1 (800) 555-0199",
  },
};
