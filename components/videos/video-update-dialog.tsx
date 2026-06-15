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
import { ExamSetCombobox } from "@/components/videos/exam-set-combobox";

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

import { useTranslations } from "next-intl";

export function VideoUpdateDialog({ video, open, onOpenChange }: VideoUpdateDialogProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("Videos.management");

  const { data: examSetsData } = useQuery(getExamSetsQueryOptions({ status: "published" }));
  const examSets = (examSetsData?.data ?? []) as ExamSetWithSchoolName[];

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
      toast.success(t("toasts.updateSuccess"));
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos", video.id] });
    },
    onError: (error: any) => {
      toast.error(t("toasts.updateError"), {
        description: error.response?.data?.error || error.message || t("toasts.tryAgain"),
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
          <DialogTitle>{t("updateTitle")}</DialogTitle>
          <DialogDescription>{t("updateDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>{t("fields.examSet")}</FieldLabel>
              <ExamSetCombobox
                examSets={examSets}
                value={form.watch("examSetId")}
                onValueChange={(value) => form.setValue("examSetId", value)}
                placeholder={t("placeholders.selectExamSet")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t("fields.problemNumber")}</FieldLabel>
                <Input
                  {...form.register("problemNumber", { required: true })}
                  type="number"
                  placeholder={t("placeholders.problemNumber")}
                />
                {form.formState.errors.problemNumber && (
                  <FieldError errors={[form.formState.errors.problemNumber as any]} />
                )}
              </Field>

              <Field>
                <FieldLabel>{t("fields.visibility")}</FieldLabel>
                <Select
                  value={form.watch("visibility")}
                  onValueChange={(value: "public" | "private" | "hidden") =>
                    form.setValue("visibility", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("placeholders.selectVisibility")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">{t("options.public")}</SelectItem>
                    <SelectItem value="private">{t("options.private")}</SelectItem>
                    <SelectItem value="hidden">{t("options.hidden")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>{t("fields.title")}</FieldLabel>
              <Input {...form.register("title")} placeholder={t("placeholders.title")} />
            </Field>

            <Field>
              <FieldLabel>{t("fields.videoUrl")}</FieldLabel>
              <Input
                {...form.register("videoUrl", { required: true })}
                placeholder={t("placeholders.videoUrl")}
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
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={updateVideoMutation.isPending}>
              {updateVideoMutation.isPending ? t("updating") : t("update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
