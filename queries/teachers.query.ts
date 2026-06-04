import { queryOptions } from "@tanstack/react-query";

import { teachersService } from "@/services/teachers.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getTeachersQueryOptions = (branchId?: string, schoolId?: string) =>
  queryOptions({
    queryKey: [...getQueryKey.teachers.all, { branchId, schoolId }],
    queryFn: () => teachersService.getAll(branchId, schoolId),
  });
