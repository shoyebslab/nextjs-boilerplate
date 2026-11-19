"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api/reports.api";

export function useReports() {
  return useQuery({
    queryKey: ["reports", "stats"],
    queryFn: () => reportsApi.getStats(),
  });
}
