export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Status styles map for badge pills across the application
 */
export const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
  posted: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20",
  partial: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 ring-1 ring-inset ring-orange-500/20",
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20",
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-inset ring-zinc-500/20",
  void: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 ring-1 ring-inset ring-red-500/20",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 ring-1 ring-inset ring-red-500/20",
  completed: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 ring-1 ring-inset ring-teal-600/20",
};

/**
 * Returns month options (January - December) with optional 'All Months' item
 */
export const getMonthOptions = (includeAll: boolean = true): SelectOption[] => {
  const months: SelectOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2026, i).toLocaleString("default", { month: "long" }),
  }));

  if (includeAll) {
    return [{ value: "all-months", label: "All Months" }, ...months];
  }
  return months;
};

/**
 * Returns short month options (Jan - Dec)
 */
export const getShortMonthOptions = (): SelectOption[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2026, i).toLocaleString("default", { month: "short" }),
  }));
};

/**
 * Generates year options around the current year
 */
export const generateYearOptions = (
  range: number = 5,
  includeAll: boolean = true
): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const years: SelectOption[] = [];

  for (let i = range; i >= -range; i--) {
    const year = currentYear + i;
    years.push({ value: String(year), label: String(year) });
  }

  if (includeAll) {
    return [{ value: "all-years", label: "All Years" }, ...years];
  }
  return years;
};

/**
 * Generates past year options up to numYears back
 */
export const generatePastYearOptions = (numYears: number = 10): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const options: SelectOption[] = [];

  for (let i = 0; i <= numYears; i++) {
    const year = currentYear - i;
    options.push({ value: String(year), label: String(year) });
  }

  return options;
};

/**
 * Calculate future date string formatted as YYYY-MM-DD
 */
export const getFutureDate = (days: number): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toISOString().split("T")[0];
};
