"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { schoolsService } from "@/services/schools.service";
import { examSetsService } from "@/services/exam-sets.service";
import type { ExamSetWithSchool } from "@/hooks/admin/use-exam-sets-management";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

interface ExamSetUpdateDialogProps {
  examSet: ExamSetWithSchool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExamSetUpdateDialog({ examSet, open, onOpenChange }: ExamSetUpdateDialogProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("ExamSets");
  const tStatus = useTranslations("ExamSets.status");

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsService.getAll(),
  });

  const [formData, setFormData] = useState<Partial<ExamSetWithSchool>>({
    schoolId: examSet.schoolId,
    year: examSet.year,
    semester: examSet.semester,
    examType: examSet.examType,
    grade: examSet.grade,
    subject: examSet.subject,
    title: examSet.title,
    status: examSet.status,
  });

  useEffect(() => {
    if (examSet) {
      setFormData({
        schoolId: examSet.schoolId,
        year: examSet.year,
        semester: examSet.semester,
        examType: examSet.examType,
        grade: examSet.grade,
        subject: examSet.subject,
        title: examSet.title,
        status: examSet.status,
      });
    }
  }, [examSet]);

  const updateExamSetMutation = useMutation({
    mutationFn: async (data: Partial<ExamSetWithSchool>) => {
      return examSetsService.update(examSet.id, data);
    },
    onSuccess: () => {
      toast.success(t("toasts.updateSuccess"));
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["examSets"] });
    },
    onError: (error: any) => {
      toast.error(t("toasts.updateError"), {
        description: error.response?.data?.error || error.message || t("toasts.tryAgain"),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId || !formData.subject || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateExamSetMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("update.title")}</DialogTitle>
          <DialogDescription>{t("update.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">School *</Label>
            <CreatableCombobox
              items={
                schools?.map((school) => ({
                  label: school.name,
                  value: school.id,
                })) || []
              }
              value={formData.schoolId || ""}
              onValueChange={(value: string) => setFormData({ ...formData, schoolId: value })}
              placeholder="Select school"
              emptyText="No schools found"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Input
                id="grade"
                type="number"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester}
                onValueChange={(value: "1st" | "2nd") =>
                  setFormData({ ...formData, semester: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Semester</SelectItem>
                  <SelectItem value="2nd">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type *</Label>
              <Select
                value={formData.examType}
                onValueChange={(value: "midterm" | "final") =>
                  setFormData({ ...formData, examType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g. Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. 2025 Mangpo High Math 1 Midterm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "published" | "hidden") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{tStatus("draft")}</SelectItem>
                <SelectItem value="published">{tStatus("published")}</SelectItem>
                <SelectItem value="hidden">{tStatus("hidden")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateExamSetMutation.isPending}
            >
              {t("update.cancel")}
            </Button>
            <Button type="submit" disabled={updateExamSetMutation.isPending}>
              {updateExamSetMutation.isPending ? t("update.saving") : t("update.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
