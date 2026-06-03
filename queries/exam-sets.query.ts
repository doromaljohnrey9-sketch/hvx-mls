import { queryOptions } from "@tanstack/react-query";

import { examSetsService } from "@/services/exam-sets.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const getExamSetsQueryOptions = () =>
  queryOptions({
    queryKey: getQueryKey.examSets.all,
    queryFn: () => examSetsService.getAll(),
  });
