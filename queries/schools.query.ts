import { queryOptions } from "@tanstack/react-query";

import { schoolsService } from "@/services/schools.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getSchoolsQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.schools.all,
    queryFn: () => schoolsService.getAll(),
  });
