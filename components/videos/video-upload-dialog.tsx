"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { examSetsService } from "@/services/exam-sets.service";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getExamSetsQueryOptions } from "@/queries/exam-sets.query";
import type { SelectExamSet } from "@/types/drizzle.types";

type ExamSetWithSchoolName = SelectExamSet & { schoolName: string };

const videoUploadSchema = {
  examSetId: "",
  problemNumber: "",
  videoUrl: "",
  title: "",
  visibility: "public",
  createNewExamSet: false,
  newExamSet: {
    schoolId: "",
    year: "",
    semester: "",
    examType: "",
    grade: "",
    subject: "Mathematics",
    title: "",
    status: "Published",
  },
};

import { useTranslations } from "next-intl";

export function VideoUploadDialog() {
  const [open, setOpen] = useState(false);
  const [createNewExamSet, setCreateNewExamSet] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("Videos.management");

  const { data: schools } = useQuery(getSchoolsQueryOptions());
  const { data: examSets } = useQuery(getExamSetsQueryOptions()) as {
    data: ExamSetWithSchoolName[] | undefined;
  };

  const form = useForm({
    defaultValues: videoUploadSchema,
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      let examSetId = data.examSetId;

      if (createNewExamSet) {
        const newExamSet = await examSetsService.create({
          schoolId: data.newExamSet.schoolId,
          year: parseInt(data.newExamSet.year),
          semester: data.newExamSet.semester as "1st" | "2nd",
          examType: data.newExamSet.examType as "midterm" | "final",
          grade: parseInt(data.newExamSet.grade),
          subject: data.newExamSet.subject,
          title: data.newExamSet.title,
          status: data.newExamSet.status as "draft" | "published" | "hidden",
        });
        if (!newExamSet) {
          throw new Error("Failed to create exam set");
        }
        examSetId = newExamSet.id;
      }

      return videosService.create({
        examSetId,
        problemNumber: parseInt(data.problemNumber),
        videoUrl: data.videoUrl,
        title: data.title || null,
        visibility: data.visibility,
      });
    },
    onSuccess: () => {
      toast.success(t("toasts.uploadSuccess"));
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error: any) => {
      toast.error(t("toasts.uploadError"), {
        description: error.response?.data?.error || error.message || t("toasts.tryAgain"),
      });
    },
  });

  const onSubmit = (data: any) => {
    createVideoMutation.mutate(data);
  };

  const tFilters = useTranslations("Videos.search.filters");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("addVideo")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("uploadTitle")}</DialogTitle>
          <DialogDescription>{t("uploadDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>{t("fields.examSet")}</FieldLabel>
              <Select
                value={createNewExamSet ? "new" : form.watch("examSetId")}
                onValueChange={(value) => {
                  if (value === "new") {
                    setCreateNewExamSet(true);
                  } else {
                    setCreateNewExamSet(false);
                    form.setValue("examSetId", value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.selectOrCreateExamSet")} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-(--radix-select-trigger-width) min-w-0"
                >
                  <SelectItem value="new">{t("placeholders.createExamSet")}</SelectItem>
                  {examSets?.map((examSet) => (
                    <SelectItem key={examSet.id} value={examSet.id} className="wrap-break-word">
                      {examSet.schoolName} - {examSet.year}{" "}
                      {examSet.semester === "1st" ? tFilters("semester1") : tFilters("semester2")}{" "}
                      {examSet.examType === "midterm" ? tFilters("midterm") : tFilters("final")}{" "}
                      {t("gradeSuffixShort", { grade: examSet.grade })} - {examSet.subject} -{" "}
                      {examSet.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {createNewExamSet && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">{t("newExamSetDetails")}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>{t("fields.school")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.schoolId")}
                      onValueChange={(value) => form.setValue("newExamSet.schoolId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectSchool")} />
                      </SelectTrigger>
                      <SelectContent>
                        {schools?.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.newExamSet?.schoolId && (
                      <FieldError errors={[form.formState.errors.newExamSet.schoolId as any]} />
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.year")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.year")}
                      onValueChange={(value) => form.setValue("newExamSet.year", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectYear")} />
                      </SelectTrigger>
                      <SelectContent>
                        {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.semester")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.semester")}
                      onValueChange={(value) => form.setValue("newExamSet.semester", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectSemester")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">{tFilters("semester1")}</SelectItem>
                        <SelectItem value="2nd">{tFilters("semester2")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.examType")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.examType")}
                      onValueChange={(value) => form.setValue("newExamSet.examType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">{tFilters("midterm")}</SelectItem>
                        <SelectItem value="final">{tFilters("final")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.grade")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.grade")}
                      onValueChange={(value) => form.setValue("newExamSet.grade", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectGrade")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{tFilters("grade1")}</SelectItem>
                        <SelectItem value="2">{tFilters("grade2")}</SelectItem>
                        <SelectItem value="3">{tFilters("grade3")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.subject")}</FieldLabel>
                    <Input
                      {...form.register("newExamSet.subject")}
                      placeholder={t("placeholders.subject")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>{t("fields.status")}</FieldLabel>
                    <Select
                      {...form.register("newExamSet.status")}
                      onValueChange={(value) => form.setValue("newExamSet.status", value)}
                      defaultValue="published"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("options.draft")}</SelectItem>
                        <SelectItem value="published">{t("options.published")}</SelectItem>
                        <SelectItem value="hidden">{t("options.hidden")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel>{t("fields.examSetTitle")}</FieldLabel>
                    <Input
                      {...form.register("newExamSet.title")}
                      placeholder={t("placeholders.examSetTitle")}
                    />
                  </Field>
                </div>
              </div>
            )}

            <Field>
              <FieldLabel>{t("fields.title")}</FieldLabel>
              <Input {...form.register("title")} placeholder={t("placeholders.title")} />
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
                  {...form.register("visibility")}
                  onValueChange={(value) => form.setValue("visibility", value)}
                  defaultValue="public"
                >
                  <SelectTrigger>
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
              onClick={() => setOpen(false)}
              disabled={createVideoMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={createVideoMutation.isPending}>
              {createVideoMutation.isPending ? t("uploading") : t("upload")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
