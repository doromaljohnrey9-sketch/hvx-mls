import type { SelectProblemVideo, SelectExamSet, SelectSchool } from "./drizzle.types";

export interface Video {
  id: string;
  examSetId: string;
  problemNumber: number;
  videoUrl: string;
  title: string | null;
  visibility: "public" | "private" | "hidden";
  createdAt: Date | null;
  updatedAt: Date | null;
  examSet: {
    id: string;
    schoolId: string;
    year: number;
    semester: "1st" | "2nd";
    examType: "midterm" | "final";
    grade: number;
    subject: string;
    title: string;
    status: "draft" | "published" | "hidden";
    school: {
      id: string;
      name: string;
      branchId: string;
    };
  };
}

export interface VideosResponse {
  videos: Video[];
  total: number;
}

export interface VideosQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  schoolId?: string;
  year?: number;
  semester?: "1st" | "2nd";
  examType?: "midterm" | "final";
  grade?: number;
  subject?: string;
  problemNumber?: number;
}
