import { queryOptions } from "@tanstack/react-query";

import { examSetsService } from "@/services/exam-sets.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { ExamSetStatus } from "@/types/drizzle.types";

export interface ExamSetsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ExamSetStatus;
}

export const getExamSetsQueryOptions = (params: ExamSetsQueryParams = {}) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.examSets.all,
      {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.status,
      },
    ],
    queryFn: () => examSetsService.getAll(params),
  });
