"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { videosService } from "@/services/videos.service";
import { getExamSetsQueryOptions } from "@/queries/exam-sets.query";
import type { Video } from "@/types/video.types";
import type { SelectExamSet } from "@/types/drizzle.types";

type ExamSetWithSchoolName = SelectExamSet & { schoolName: string };

interface VideoUpdateDialogProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const videoUpdateSchema = {
  examSetId: "",
  problemNumber: "",
  videoUrl: "",
  title: "",
  visibility: "public",
};

export function VideoUpdateDialog({ video, open, onOpenChange }: VideoUpdateDialogProps) {
  const queryClient = useQueryClient();

  const { data: examSets } = useQuery(getExamSetsQueryOptions()) as {
    data: ExamSetWithSchoolName[] | undefined;
  };

  const form = useForm({
    defaultValues: {
      examSetId: video.examSetId,
      problemNumber: video.problemNumber.toString(),
      videoUrl: video.videoUrl,
      title: video.title || "",
      visibility: video.visibility,
    },
  });

  useEffect(() => {
    form.reset({
      examSetId: video.examSetId,
      problemNumber: video.problemNumber.toString(),
      videoUrl: video.videoUrl,
      title: video.title || "",
      visibility: video.visibility,
    });
  }, [video, form]);

  const updateVideoMutation = useMutation({
    mutationFn: async (data: {
      examSetId: string;
      problemNumber: string;
      videoUrl: string;
      title: string;
      visibility: string;
    }) => {
      return videosService.update(video.id, {
        examSetId: data.examSetId,
        problemNumber: parseInt(data.problemNumber),
        videoUrl: data.videoUrl,
        title: data.title || null,
        visibility: data.visibility as "public" | "private" | "hidden",
      });
    },
    onSuccess: () => {
      toast.success("Video updated successfully");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos", video.id] });
    },
    onError: (error: any) => {
      toast.error("Failed to update video", {
        description: error.response?.data?.error || error.message || "Please try again",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateVideoMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Video</DialogTitle>
          <DialogDescription>
            Update the video details including exam set and problem number.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Exam Set</FieldLabel>
              <Select
                value={form.watch("examSetId")}
                onValueChange={(value) => form.setValue("examSetId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam set" />
                </SelectTrigger>
                <SelectContent>
                  {examSets?.map((examSet) => (
                    <SelectItem key={examSet.id} value={examSet.id}>
                      {examSet.schoolName} - {examSet.year} {examSet.semester} {examSet.examType} G
                      {examSet.grade} - {examSet.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Problem Number</FieldLabel>
                <Input
                  {...form.register("problemNumber", { required: true })}
                  type="number"
                  placeholder="1"
                />
                {form.formState.errors.problemNumber && (
                  <FieldError errors={[form.formState.errors.problemNumber as any]} />
                )}
              </Field>

              <Field>
                <FieldLabel>Visibility</FieldLabel>
                <Select
                  value={form.watch("visibility")}
                  onValueChange={(value: "public" | "private" | "hidden") =>
                    form.setValue("visibility", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Title (Optional)</FieldLabel>
              <Input {...form.register("title")} placeholder="Solution for problem 1" />
            </Field>

            <Field>
              <FieldLabel>Video URL</FieldLabel>
              <Input
                {...form.register("videoUrl", { required: true })}
                placeholder="https://youtube.com/watch?v=..."
              />
              {form.formState.errors.videoUrl && (
                <FieldError errors={[form.formState.errors.videoUrl as any]} />
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateVideoMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateVideoMutation.isPending}>
              {updateVideoMutation.isPending ? "Updating..." : "Update Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
