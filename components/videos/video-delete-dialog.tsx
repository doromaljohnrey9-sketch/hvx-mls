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

export function VideoDeleteDialog({ video, open, onOpenChange }: VideoDeleteDialogProps) {
  const queryClient = useQueryClient();

  const deleteVideoMutation = useMutation({
    mutationFn: async () => {
      return videosService.delete(video.id);
    },
    onSuccess: () => {
      toast.success("Video deleted successfully");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos", video.id] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete video", {
        description: error.response?.data?.error || error.message || "Please try again",
      });
    },
  });

  const handleDelete = () => {
    deleteVideoMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Video</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the video for problem {video.problemNumber}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteVideoMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteVideoMutation.isPending}
          >
            {deleteVideoMutation.isPending ? "Deleting..." : "Delete Video"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
