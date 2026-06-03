"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardStatsQueryOptions } from "@/queries/dashboard.query";

export function useDashboard() {
  const stats = useQuery(getDashboardStatsQueryOptions());

  return {
    stats,
    isLoading: stats.isLoading,
  };
}
