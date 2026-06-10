"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { studentService } from "@/services/student.service";
import { getStudentsQueryOptions } from "@/queries/students.query";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { StudentUpdate } from "@/types/student.types";
import type { ApprovalStatus } from "@/types/drizzle.types";

export function useAdminStudentManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const students = useQuery(
    getStudentsQueryOptions({
      page,
      pageSize,
      search: searchQuery || undefined,
      approvalStatus:
        approvalStatusFilter === "all" ? undefined : (approvalStatusFilter as ApprovalStatus),
      branchId: branchFilter === "all" ? undefined : branchFilter,
      schoolId: schoolFilter === "all" ? undefined : schoolFilter,
      grade: gradeFilter === "all" ? undefined : parseInt(gradeFilter),
    })
  );

  const updateStudent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StudentUpdate }) => {
      return studentService.updateStudent(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.students.all });
    },
    onError: (error: any) => {
      console.error("Failed to update student:", error);
      toast.error("Failed to update student", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const updateStudentApprovalStatus = useMutation({
    mutationFn: async ({ id, approvalStatus }: { id: string; approvalStatus: ApprovalStatus }) => {
      return studentService.updateStudentApprovalStatus(id, approvalStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.students.all });
    },
    onError: (error: any) => {
      console.error("Failed to update student approval status:", error);
      toast.error("Failed to update student approval status", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const updateStudentGrade = useMutation({
    mutationFn: async ({ id, grade }: { id: string; grade: number }) => {
      return studentService.updateStudentGrade(id, grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.students.all });
    },
    onError: (error: any) => {
      console.error("Failed to update student grade:", error);
      toast.error("Failed to update student grade", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const updateStudentTeacher = useMutation({
    mutationFn: async ({ id, assignedTeacher }: { id: string; assignedTeacher: string }) => {
      return studentService.updateStudentTeacher(id, assignedTeacher);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.students.all });
    },
    onError: (error: any) => {
      console.error("Failed to update student teacher:", error);
      toast.error("Failed to update student teacher", {
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

  const handleApprovalStatusFilterChange = (value: string) => {
    setApprovalStatusFilter(value);
    setPage(1);
  };

  const handleBranchFilterChange = (value: string) => {
    setBranchFilter(value);
    setPage(1);
  };

  const handleSchoolFilterChange = (value: string) => {
    setSchoolFilter(value);
    setPage(1);
  };

  const handleGradeFilterChange = (value: string) => {
    setGradeFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = students.data ? Math.ceil(students.data.total / pageSize) : 0;

  return {
    students,
    updateStudent,
    updateStudentApprovalStatus,
    updateStudentGrade,
    updateStudentTeacher,
    isLoading: students.isLoading,
    search: searchInput,
    approvalStatusFilter,
    branchFilter,
    schoolFilter,
    gradeFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleApprovalStatusFilterChange,
    handleBranchFilterChange,
    handleSchoolFilterChange,
    handleGradeFilterChange,
    handlePageChange,
  };
}
