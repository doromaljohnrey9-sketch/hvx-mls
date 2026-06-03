import { queryOptions } from "@tanstack/react-query";

import { adminService } from "@/services/admin.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { UserRole } from "@/types/drizzle.types";

export const getStudentsQueryOptions = (roleFilter?: UserRole) =>
  queryOptions({
    queryKey: [...getQueryKey.users.all, "students", roleFilter ?? "all"],
    queryFn: () => adminService.getStudents(roleFilter),
  });
