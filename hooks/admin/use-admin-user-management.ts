"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { adminService } from "@/services/admin.service";
import { getAdminUsersQueryOptions } from "@/queries/admin-users.query";
import { getQueryKey } from "@/lib/query/get-query-keys";
import type { AdminUserUpdate } from "@/types/admin.types";
import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";

export function useAdminUserManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>("all");

  const users = useQuery(
    getAdminUsersQueryOptions({
      page,
      pageSize,
      search: searchQuery || undefined,
      role: roleFilter === "all" ? undefined : (roleFilter as any),
      approvalStatus:
        approvalStatusFilter === "all" ? undefined : (approvalStatusFilter as ApprovalStatus),
    })
  );

  const updateUser = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AdminUserUpdate }) => {
      await adminService.updateUser(id, updates);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.users() });
    },
    onError: (error: any) => {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      role?: UserRole;
      branchId?: string;
      schoolId?: string;
      grade?: number;
      assignedTeacher?: string;
      approvalStatus?: ApprovalStatus;
    }) => {
      return adminService.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.users() });
    },
    onError: (error: any) => {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      return adminService.resetPassword(id, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey.admin.users() });
    },
    onError: (error: any) => {
      console.error("Failed to reset password:", error);
      toast.error("Failed to reset password", {
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

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleApprovalStatusFilterChange = (value: string) => {
    setApprovalStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = users.data ? Math.ceil(users.data.total / pageSize) : 0;

  return {
    users,
    updateUser,
    createUser,
    resetPassword,
    isLoading: users.isLoading,
    search: searchInput,
    roleFilter,
    approvalStatusFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleRoleFilterChange,
    handleApprovalStatusFilterChange,
    handlePageChange,
  };
}
