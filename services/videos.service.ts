import { axiosInstance } from "@/config/axios.config";
import type { VideosResponse, VideosQueryParams } from "@/types/video.types";

import { API_ROUTES } from "@/constants/routes.constant";

export const videosService = {
  getVideos: async (params: VideosQueryParams): Promise<VideosResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.schoolId) queryParams.append("schoolId", params.schoolId);
      if (params.year) queryParams.append("year", params.year.toString());
      if (params.semester) queryParams.append("semester", params.semester.toString());
      if (params.examType) queryParams.append("examType", params.examType);
      if (params.grade) queryParams.append("grade", params.grade.toString());
      if (params.subject) queryParams.append("subject", params.subject);
      if (params.problemNumber) queryParams.append("problemNumber", params.problemNumber.toString());

      const url = `${API_ROUTES.VIDEOS}?${queryParams.toString()}`;
      const response = await axiosInstance.get<{ success: boolean; data: VideosResponse }>(url);
      return response.data.data ?? { videos: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return { videos: [], total: 0 };
    }
  },
};
