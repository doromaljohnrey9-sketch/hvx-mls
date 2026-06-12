"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { examSetsService } from "@/services/exam-sets.service";
import { getExamSetsQueryOptions } from "@/queries/exam-sets.query";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { InsertExamSet, SelectExamSet, ExamSetStatus } from "@/types/drizzle.types";

export type ExamSetWithSchool = SelectExamSet & { schoolName?: string };

export function useExamSetsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const examSets = useQuery(
    getExamSetsQueryOptions({
      page,
      pageSize,
      search: searchQuery || undefined,
      status: statusFilter === "all" ? undefined : (statusFilter as ExamSetStatus),
    })
  );

  const createExamSet = useMutation({
    mutationFn: async (data: InsertExamSet) => {
      return examSetsService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.examSets.all });
    },
    onError: (error: any) => {
      console.error("Failed to create exam set:", error);
      toast.error("Failed to create exam set", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const updateExamSet = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertExamSet> }) => {
      return examSetsService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.examSets.all });
      toast.success("Exam set updated successfully");
    },
    onError: (error: any) => {
      console.error("Failed to update exam set:", error);
      toast.error("Failed to update exam set", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const deleteExamSet = useMutation({
    mutationFn: async (id: string) => {
      return examSetsService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.examSets.all });
      toast.success("Exam set deleted successfully");
    },
    onError: (error: any) => {
      console.error("Failed to delete exam set:", error);
      toast.error("Failed to delete exam set", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = examSets.data ? Math.ceil(examSets.data.total / pageSize) : 0;

  return {
    examSets,
    createExamSet,
    updateExamSet,
    deleteExamSet,
    isLoading: examSets.isLoading,
    search: searchInput,
    statusFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handlePageChange,
  };
}
