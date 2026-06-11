"use client";

import { useAdminUserManagement } from "@/hooks/admin/use-admin-user-management";
import { UsersPageHeader } from "@/components/admin/user-management/users-page-header";
import { UsersTable } from "@/components/admin/user-management/users-table";
import { UsersFilters } from "@/components/admin/user-management/users-filters";
import { createUsersColumns } from "@/components/admin/user-management/users-columns";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

export function AdminUsersPageClient() {
  const t = useTranslations("UserManagement");
  const tRoles = useTranslations("Dashboard.roles");
  const tFilters = useTranslations("UserManagement.filters");

  const { user } = useAuth();
  const {
    users,
    isLoading,
    updateUser,
    createUser,
    resetPassword,
    search,
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
  } = useAdminUserManagement();

  const columns = createUsersColumns({
    updateUser: updateUser,
    resetPassword: resetPassword,
    currentUserId: user?.id,
    t,
    tRoles,
    tFilters,
  });

  const handleCreateUser = (data: any) => {
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success(t("toasts.created"), {
          description: t("toasts.createdDesc"),
        });
      },
    });
  };

  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <UsersPageHeader />
      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        approvalStatusFilter={approvalStatusFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onRoleFilterChange={handleRoleFilterChange}
        onApprovalStatusFilterChange={handleApprovalStatusFilterChange}
        onCreateUser={handleCreateUser}
      />
      <UsersTable
        columns={columns}
        data={users.data?.users ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: users.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
