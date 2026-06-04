import { queryOptions } from "@tanstack/react-query";

import { adminService } from "@/services/admin.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { AdminUsersQueryParams } from "@/types/admin.types";

export const getAdminUsersQueryOptions = (params: AdminUsersQueryParams) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.admin.users(),
      {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        role: params.role,
        approvalStatus: params.approvalStatus,
      },
    ],
    queryFn: () => adminService.getAdminUsers(params),
  });
