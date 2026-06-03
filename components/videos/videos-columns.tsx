"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon, PlayIcon } from "lucide-react";

import type { Video } from "@/types/video.types";

export function createVideosColumns() {
  const columns: ColumnDef<Video>[] = [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span className="font-medium">{video.examSet.school.name}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span>{video.examSet.year}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span>{video.examSet.semester}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span>{video.examSet.examType}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span>{video.examSet.grade}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span>{video.examSet.subject}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span className="font-medium">{video.problemNumber}</span>;
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
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return <span className="text-sm text-muted-foreground">{video.title || "N/A"}</span>;
      },
      size: 200,
    },
    {
      id: "actions",
      header: () => <div className="text-sm font-medium">Actions</div>,
      cell: ({ row }) => {
        const video = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.open(video.videoUrl, "_blank");
            }}
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Watch
          </Button>
        );
      },
      size: 100,
    },
  ];

  return columns;
}
