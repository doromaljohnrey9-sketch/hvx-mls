"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PlayIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "@/i18n/routing";

import type { Video } from "@/types/video.types";

interface VideoActionsDropdownProps {
  video: Video;
  userRole?: string;
  onUpdate?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

import { useTranslations } from "next-intl";

export function VideoActionsDropdown({
  video,
  userRole,
  onUpdate,
  onDelete,
}: VideoActionsDropdownProps) {
  const router = useRouter();
  const t = useTranslations("Videos.table");
  const canManage = userRole === "super_admin" || userRole === "teacher";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/videos/${video.id}`);
          }}
        >
          <PlayIcon className="size-4 mr-2" />
          {t("watch")}
        </DropdownMenuItem>
        {canManage && onUpdate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onUpdate(video);
              }}
            >
              <PencilIcon className="size-4 mr-2" />
              {t("edit")}
            </DropdownMenuItem>
          </>
        )}
        {canManage && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onDelete(video);
              }}
              className="text-destructive"
            >
              <Trash2Icon className="size-4 mr-2" />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
