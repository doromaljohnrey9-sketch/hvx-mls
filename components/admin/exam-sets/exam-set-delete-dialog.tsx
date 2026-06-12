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

import { examSetsService } from "@/services/exam-sets.service";
import type { ExamSetWithSchool } from "@/hooks/admin/use-exam-sets-management";

interface ExamSetDeleteDialogProps {
  examSet: ExamSetWithSchool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useTranslations } from "next-intl";

export function ExamSetDeleteDialog({ examSet, open, onOpenChange }: ExamSetDeleteDialogProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("ExamSets");

  const deleteExamSetMutation = useMutation({
    mutationFn: async () => {
      return examSetsService.delete(examSet.id);
    },
    onSuccess: () => {
      toast.success(t("toasts.deleteSuccess"));
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["examSets"] });
    },
    onError: (error: any) => {
      toast.error(t("toasts.deleteError"), {
        description: error.response?.data?.error || error.message || t("toasts.tryAgain"),
      });
    },
  });

  const handleDelete = () => {
    deleteExamSetMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent drop-shadow-lg>
        <DialogHeader>
          <DialogTitle>{t("delete.title")}</DialogTitle>
          <DialogDescription>
            {t("delete.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteExamSetMutation.isPending}
          >
            {t("delete.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteExamSetMutation.isPending}
          >
            {deleteExamSetMutation.isPending ? t("delete.deleting") : t("delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
