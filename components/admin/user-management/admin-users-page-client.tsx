"use client";

import { useAdminUserManagement } from "@/hooks/admin/use-admin-user-management";
import { UsersPageHeader } from "@/components/admin/user-management/users-page-header";
import { UsersTable } from "@/components/admin/user-management/users-table";
import { UsersFilters } from "@/components/admin/user-management/users-filters";
import { createUsersColumns } from "@/components/admin/user-management/users-columns";

export function AdminUsersPageClient() {
  const {
    users,
    isLoading,
    updateUser,
    search,
    roleFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleRoleFilterChange,
    handlePageChange,
  } = useAdminUserManagement();

  const columns = createUsersColumns({ updateUser: updateUser });

  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <UsersPageHeader />
      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onRoleFilterChange={handleRoleFilterChange}
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
