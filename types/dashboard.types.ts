export interface DashboardStats {
  totalUsers: number;
  totalExamSets: number;
  totalVideos: number;
  usersByRole: { role: string; count: number }[];
  examSetsByStatus: { status: string; count: number }[];
  usersThisWeek: number;
  publishedExamSets: number;
}
