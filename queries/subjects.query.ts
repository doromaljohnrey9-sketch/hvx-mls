import { queryOptions } from "@tanstack/react-query";
import { subjectsService } from "@/services/subjects.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getSubjectsQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.subjects.all,
    queryFn: () => subjectsService.getAll(),
  });
