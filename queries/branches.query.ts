import { queryOptions } from "@tanstack/react-query";

import { branchesService } from "@/services/branches.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getBranchesQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.branches.all,
    queryFn: () => branchesService.getAll(),
  });
