"use client";

import { Users, FileText, Play } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_CHART_CONFIG,
  DASHBOARD_ROLE_COLOR_MAP,
  DASHBOARD_STATUS_COLOR_MAP,
} from "@/constants/dashboard.constant";
import { useDashboard } from "@/hooks/use-dashboard";

export const PageClient = () => {
  const { stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
        <div className="min-h-[50vh] flex-1 rounded-xl md:min-h-min">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const usersByRoleData = stats.data?.usersByRole || [];
  const examSetsByStatusData = stats.data?.examSetsByStatus || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.data?.usersThisWeek ?? 0} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam sets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalExamSets ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.data?.publishedExamSets ?? 0} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalVideos ?? 0}</div>
            <p className="text-xs text-muted-foreground">Across all sets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>USERS BY ROLE</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={DASHBOARD_CHART_CONFIG}>
              <BarChart
                data={usersByRoleData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="role"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const label =
                      DASHBOARD_CHART_CONFIG[value as keyof typeof DASHBOARD_CHART_CONFIG]?.label ||
                      value;
                    return label.charAt(0).toUpperCase() + label.slice(1);
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {usersByRoleData.map((entry) => (
                    <Cell
                      key={entry.role}
                      fill={DASHBOARD_ROLE_COLOR_MAP[entry.role] || "#6b7280"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EXAM SETS BY STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={DASHBOARD_CHART_CONFIG}>
              <BarChart
                data={examSetsByStatusData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const label =
                      DASHBOARD_CHART_CONFIG[value as keyof typeof DASHBOARD_CHART_CONFIG]?.label ||
                      value;
                    return label.charAt(0).toUpperCase() + label.slice(1);
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {examSetsByStatusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={DASHBOARD_STATUS_COLOR_MAP[entry.status] || "#6b7280"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
