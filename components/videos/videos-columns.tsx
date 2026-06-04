"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

import { VideoActionsDropdown } from "@/components/videos/video-actions-dropdown";

import { toSentenceCase } from "@/lib/utils";

import type { Video } from "@/types/video.types";

interface CreateVideosColumnsProps {
  userRole?: string;
  onUpdate?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

export function createVideosColumns({ userRole, onUpdate, onDelete }: CreateVideosColumnsProps) {
  const columns: ColumnDef<Video>[] = [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      id: "watch",
      header: () => <div className="text-sm font-semibold text-foreground">Watch</div>,
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
            Watch
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
          Title
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <span className="font-semibold text-sm text-foreground truncate">
            {video.title || "N/A"}
          </span>
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
          School
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
          Year
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
          Semester
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{video.examSet.semester}</span>
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
          Exam Type
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">
              {toSentenceCase(video.examSet.examType)}
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
          Grade
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
          Subject
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
          Problem No.
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
      id: "actions",
      header: () => <div className="text-sm font-semibold text-foreground">Actions</div>,
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
