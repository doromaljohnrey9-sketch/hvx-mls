import { queryOptions } from "@tanstack/react-query";

import { videosService } from "@/services/videos.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { VideosQueryParams } from "@/types/video.types";

export const getVideosQueryOptions = (params: VideosQueryParams) =>
  queryOptions({
    queryKey: [
      ...getQueryKey.videos.all,
      {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        schoolId: params.schoolId,
        year: params.year,
        semester: params.semester,
        examType: params.examType,
        grade: params.grade,
        subject: params.subject,
        problemNumber: params.problemNumber,
      },
    ],
    queryFn: () => videosService.getVideos(params),
  });
