import { queryOptions } from "@tanstack/react-query";

import { studentService } from "@/services/student.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { StudentsQueryParams } from "@/types/student.types";

export const getStudentsQueryOptions = (params: StudentsQueryParams) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.students.all,
      {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        approvalStatus: params.approvalStatus,
        branchId: params.branchId,
        schoolId: params.schoolId,
        grade: params.grade,
      },
    ],
    queryFn: () => studentService.getStudents(params),
  });
