import { format, parseISO, isValid } from "date-fns";

export interface DateFormatConfig {
  code?: string;
  format_pattern: string;
  title?: string;
}

const DEFAULT_DATE_FORMAT: DateFormatConfig = {
  code: "iso",
  format_pattern: "dd MMM, yyyy",
  title: "Default Format",
};

/**
 * Format any date string or Date object with safety checks
 */
export function dateFormatter(
  dateValue?: string | Date | null,
  patternOrConfig: string | DateFormatConfig = DEFAULT_DATE_FORMAT
): string {
  if (!dateValue) return "";

  const pattern =
    typeof patternOrConfig === "string"
      ? patternOrConfig
      : patternOrConfig?.format_pattern || "dd MMM, yyyy";

  try {
    let date: Date;
    if (typeof dateValue === "string") {
      const cleanDate = dateValue.includes("T") ? dateValue.split("T")[0] : dateValue;
      date = parseISO(cleanDate);
    } else {
      date = dateValue;
    }

    if (!isValid(date)) return "";

    return format(date, pattern);
  } catch {
    return "";
  }
}

/**
 * Generates formatted timestamp string suitable for file downloads (e.g., "20261122_1015AM")
 */
export function getFileNameDateTime(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  const hoursFormatted = String(hours ? hours : 12).padStart(2, "0");

  return `${year}${month}${day}_${hoursFormatted}${minutes}${ampm}`;
}
