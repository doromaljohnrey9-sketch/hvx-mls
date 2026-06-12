"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { schoolsService } from "@/services/schools.service";
import type { InsertExamSet } from "@/types/drizzle.types";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

interface ExamSetCreateDialogProps {
  onCreateExamSet: (data: InsertExamSet) => void;
}

export function ExamSetCreateDialog({ onCreateExamSet }: ExamSetCreateDialogProps) {
  const t = useTranslations("ExamSets");
  const tStatus = useTranslations("ExamSets.status");
  const [open, setOpen] = useState(false);

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsService.getAll(),
  });

  const [formData, setFormData] = useState<Partial<InsertExamSet>>({
    schoolId: "",
    year: new Date().getFullYear(),
    semester: "1st",
    examType: "midterm",
    grade: 1,
    subject: "",
    title: "",
    status: "draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId || !formData.subject || !formData.title) {
      alert("Please fill in all required fields");
      return;
    }
    onCreateExamSet(formData as InsertExamSet);
    setOpen(false);
    setFormData({
      schoolId: "",
      year: new Date().getFullYear(),
      semester: "1st",
      examType: "midterm",
      grade: 1,
      subject: "",
      title: "",
      status: "draft",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("createExamSet")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createExamSet")}</DialogTitle>
          <DialogDescription>Fill in the details to create a new exam set.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{t("createExamSet")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
