import { queryOptions } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getDashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: [...getQueryKey.dashboard.all, "stats"],
    queryFn: () => dashboardService.getStats(),
  });
