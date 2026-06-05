"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { videosService } from "@/services/videos.service";
import type { Video } from "@/types/video.types";

interface VideoDeleteDialogProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useTranslations } from "next-intl";

export function VideoDeleteDialog({ video, open, onOpenChange }: VideoDeleteDialogProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("Videos.management");

  const deleteVideoMutation = useMutation({
    mutationFn: async () => {
      return videosService.delete(video.id);
    },
    onSuccess: () => {
      toast.success(t("toasts.deleteSuccess"));
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos", video.id] });
    },
    onError: (error: any) => {
      toast.error(t("toasts.deleteError"), {
        description: error.response?.data?.error || error.message || t("toasts.tryAgain"),
      });
    },
  });

  const handleDelete = () => {
    deleteVideoMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent drop-shadow-lg>
        <DialogHeader>
          <DialogTitle>{t("deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("deleteDescription", { problemNumber: video.problemNumber })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteVideoMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteVideoMutation.isPending}
          >
            {deleteVideoMutation.isPending ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
