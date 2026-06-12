"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowUpDownIcon,
  PlayIcon,
  SchoolIcon,
  Calendar,
  BookOpen,
  Clock,
  ClipboardList,
  Award,
  Hash,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";

import { VideoActionsDropdown } from "@/components/videos/video-actions-dropdown";

import { toSentenceCase } from "@/lib/utils";

import type { Video } from "@/types/video.types";

import { useTranslations } from "next-intl";

interface CreateVideosColumnsProps {
  userRole?: string;
  onUpdate?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  t: ReturnType<typeof useTranslations<"Videos">>;
  tFilters: ReturnType<typeof useTranslations<"Videos.search.filters">>;
}

export function createVideosColumns({
  userRole,
  onUpdate,
  onDelete,
  t,
  tFilters,
}: CreateVideosColumnsProps) {
  const columns: ColumnDef<Video>[] = [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      id: "watch",
      header: () => <div className="text-sm font-semibold text-foreground">{t("table.watch")}</div>,
      cell: ({ row }) => {
        const video = row.original;
        const router = useRouter();
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push(`/videos/${video.id}`);
            }}
          >
            <PlayIcon className="size-4 mr-2" />
            {t("table.watch")}
          </Button>
        );
      },
      size: 120,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.title")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-semibold text-sm text-foreground whitespace-normal wrap-break-word cursor-help">
                {video.title || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{video.title || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 200,
    },
    {
      accessorKey: "examSet.school.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.school")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <SchoolIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.examSet.school.name}</span>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "examSet.year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.year")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.examSet.year}</span>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "examSet.semester",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.semester")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {video.examSet.semester === "1st" ? tFilters("semester1") : tFilters("semester2")}
            </span>
          </div>
        );
      },
      size: 140,
    },
    {
      accessorKey: "examSet.examType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.examType")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {video.examSet.examType === "midterm" ? tFilters("midterm") : tFilters("final")}
            </span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "examSet.grade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.grade")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <Award className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.examSet.grade}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "examSet.subject",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.subject")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.examSet.subject}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "problemNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.problemNo")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.problemNumber}</span>
          </div>
        );
      },
      size: 140,
    },
    {
      accessorKey: "visibility",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          {t("table.visibility")}
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        const visibility = video.visibility;
        const variant = visibility === "public" ? "default" : "secondary";

        const icon =
          visibility === "public" ? (
            <Eye className="size-3" />
          ) : visibility === "private" ? (
            <Lock className="size-3" />
          ) : (
            <EyeOff className="size-3" />
          );

        return (
          <Badge variant={variant} className="text-xs gap-1.5">
            {icon}
            {t(`management.options.${visibility}`)}
          </Badge>
        );
      },
      size: 140,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-sm font-semibold text-foreground">{t("table.actions")}</div>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <VideoActionsDropdown
            video={video}
            userRole={userRole}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        );
      },
      size: 80,
    },
  ];

  return columns;
}
