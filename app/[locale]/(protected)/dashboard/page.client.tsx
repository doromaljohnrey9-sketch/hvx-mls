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

import { useTranslations } from "next-intl";

export const PageClient = () => {
  const t = useTranslations("Dashboard");
  const tRoles = useTranslations("Dashboard.roles");
  const tStatuses = useTranslations("Dashboard.statuses");
  const { stats, isLoading } = useDashboard();

  const chartConfig = {
    count: {
      label: t("count"),
    },
    student: {
      label: tRoles("student"),
      color: DASHBOARD_CHART_CONFIG.student.color,
    },
    teacher: {
      label: tRoles("teacher"),
      color: DASHBOARD_CHART_CONFIG.teacher.color,
    },
    admin: {
      label: tRoles("admin"),
      color: DASHBOARD_CHART_CONFIG.admin.color,
    },
    branch_admin: {
      label: tRoles("branch_admin"),
      color: DASHBOARD_CHART_CONFIG.branch_admin.color,
    },
    super_admin: {
      label: tRoles("super_admin"),
      color: DASHBOARD_CHART_CONFIG.super_admin.color,
    },
    staff: {
      label: tRoles("staff"),
      color: DASHBOARD_CHART_CONFIG.staff.color,
    },
    draft: {
      label: tStatuses("draft"),
      color: DASHBOARD_CHART_CONFIG.none.color,
    },
    pending: {
      label: tStatuses("pending"),
      color: DASHBOARD_CHART_CONFIG.pending.color,
    },
    denied: {
      label: tStatuses("denied"),
      color: DASHBOARD_CHART_CONFIG.denied.color,
    },
    blocked: {
      label: tStatuses("blocked"),
      color: DASHBOARD_CHART_CONFIG.blocked.color,
    },
    none: {
      label: tStatuses("none"),
      color: DASHBOARD_CHART_CONFIG.none.color,
    },
    partial: {
      label: tStatuses("partial"),
      color: DASHBOARD_CHART_CONFIG.partial.color,
    },
    complete: {
      label: tStatuses("complete"),
      color: DASHBOARD_CHART_CONFIG.complete.color,
    },
    published: {
      label: tStatuses("published"),
      color: DASHBOARD_CHART_CONFIG.complete.color,
    },
    hidden: {
      label: tStatuses("hidden"),
      color: DASHBOARD_CHART_CONFIG.none.color,
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
        <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    );
  }

  const usersByRoleData = stats.data?.usersByRole ?? [];
  const examSetsByStatusData = stats.data?.examSetsByStatus ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("usersThisWeek", { count: stats.data?.usersThisWeek || 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("examSets")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalExamSets || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("publishedSets", { count: stats.data?.publishedExamSets || 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("videos")}</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.totalVideos || 0}</div>
            <p className="text-xs text-muted-foreground">{t("acrossAllSets")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("usersByRole")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
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
                    return tRoles(value as Parameters<typeof tRoles>[0]);
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {usersByRoleData.map((entry: { role: string; count: number }) => (
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
            <CardTitle>{t("examSetsByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
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
                    return tStatuses(value as Parameters<typeof tStatuses>[0]);
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {examSetsByStatusData.map((entry: { status: string; count: number }) => (
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
