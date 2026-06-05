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

export function VideoUploadDialog() {
  const [open, setOpen] = useState(false);
  const [createNewExamSet, setCreateNewExamSet] = useState(false);
  const queryClient = useQueryClient();

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
      toast.success("Video uploaded successfully");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error: any) => {
      toast.error("Failed to upload video", {
        description: error.response?.data?.error || error.message || "Please try again",
      });
    },
  });

  const onSubmit = (data: any) => {
    createVideoMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Add a new exam solution video with the required metadata.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Exam Set</FieldLabel>
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
                  <SelectValue placeholder="Select or create exam set" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)] min-w-0"
                >
                  <SelectItem value="new">+ Create New Exam Set</SelectItem>
                  {examSets?.map((examSet) => (
                    <SelectItem key={examSet.id} value={examSet.id} className="wrap-break-word">
                      {examSet.schoolName} - {examSet.year} {examSet.semester} {examSet.examType} G
                      {examSet.grade} - {examSet.subject} - {examSet.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {createNewExamSet && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">New Exam Set Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>School</FieldLabel>
                    <Select
                      {...form.register("newExamSet.schoolId")}
                      onValueChange={(value) => form.setValue("newExamSet.schoolId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
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
                    <FieldLabel>Year</FieldLabel>
                    <Select
                      {...form.register("newExamSet.year")}
                      onValueChange={(value) => form.setValue("newExamSet.year", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
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
                    <FieldLabel>Semester</FieldLabel>
                    <Select
                      {...form.register("newExamSet.semester")}
                      onValueChange={(value) => form.setValue("newExamSet.semester", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Semester</SelectItem>
                        <SelectItem value="2nd">2nd Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Exam Type</FieldLabel>
                    <Select
                      {...form.register("newExamSet.examType")}
                      onValueChange={(value) => form.setValue("newExamSet.examType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Grade</FieldLabel>
                    <Select
                      {...form.register("newExamSet.grade")}
                      onValueChange={(value) => form.setValue("newExamSet.grade", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Subject</FieldLabel>
                    <Input {...form.register("newExamSet.subject")} placeholder="Mathematics" />
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      {...form.register("newExamSet.status")}
                      onValueChange={(value) => form.setValue("newExamSet.status", value)}
                      defaultValue="published"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel>Exam Set Title</FieldLabel>
                    <Input
                      {...form.register("newExamSet.title")}
                      placeholder="2024 1st Semester Midterm Exam"
                    />
                  </Field>
                </div>
              </div>
            )}

            <Field>
              <FieldLabel>Title (Optional)</FieldLabel>
              <Input {...form.register("title")} placeholder="Solution for problem 1" />
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
                  {...form.register("visibility")}
                  onValueChange={(value) => form.setValue("visibility", value)}
                  defaultValue="public"
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
              onClick={() => setOpen(false)}
              disabled={createVideoMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createVideoMutation.isPending}>
              {createVideoMutation.isPending ? "Uploading..." : "Upload Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
