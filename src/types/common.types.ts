export type ThemeMode = "light" | "dark" | "system";

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  roles?: string[];
  permissions?: string[];
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
