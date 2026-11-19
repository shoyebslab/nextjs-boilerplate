import { NavItem, NavSection } from "@/types/common.types";
import { ROLES, PERMISSIONS } from "./permissions.config";

export const WEBSITE_NAV: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export const DASHBOARD_NAV_SECTIONS: NavSection[] = [
  {
    title: "General",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: "LayoutDashboard",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        title: "Reports & Analytics",
        href: "/dashboard/reports",
        icon: "BarChart3",
        permissions: [PERMISSIONS.REPORTS_VIEW],
      },
    ],
  },
  {
    title: "Access Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: "Users",
        permissions: [PERMISSIONS.USERS_VIEW],
      },
      {
        title: "Roles",
        href: "/dashboard/roles",
        icon: "Shield",
        permissions: [PERMISSIONS.ROLES_VIEW],
      },
      {
        title: "Permissions",
        href: "/dashboard/permissions",
        icon: "Key",
        permissions: [PERMISSIONS.PERMISSIONS_VIEW],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: "Settings",
        permissions: [PERMISSIONS.SETTINGS_VIEW],
      },
    ],
  },
];
