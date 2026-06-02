"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getStudentsQueryOptions } from "@/queries/admin.query";
import { adminService } from "@/services/admin.service";
import { getQueryKey } from "@/lib/query/get-query-keys";

import type { UserRole } from "@/types/drizzle.types";

const ROLE_LABELS: Record<string, string> = {
  pending: "Pending",
  student: "Student",
  teacher: "Teacher",
  branch_admin: "Branch Admin",
  super_admin: "Super Admin",
};

const ROLE_FILTER_OPTIONS: { label: string; value: UserRole | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
];

export function PageClient() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [isPending, startTransition] = useTransition();

  const filterValue = roleFilter === "all" ? undefined : roleFilter;
  const { data: students = [], isLoading } = useQuery(getStudentsQueryOptions(filterValue));

  const handleRoleUpdate = (userId: string, role: UserRole, actionLabel: string) => {
    startTransition(async () => {
      const success = await adminService.updateStudentRole(userId, role);
      if (success) {
        toast.success(`User ${actionLabel}ed successfully`);
        queryClient.invalidateQueries({ queryKey: getQueryKey.users.all });
      } else {
        toast.error(`Failed to ${actionLabel} user`);
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Approve, reject, or block student accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2">
            {ROLE_FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={roleFilter === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Student List */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No users found.
            </p>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{student.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border px-2 py-0.5 text-xs">
                      {ROLE_LABELS[student.role] ?? student.role}
                    </span>
                    {student.role === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleRoleUpdate(student.id, "student", "Approve")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleRoleUpdate(student.id, "pending", "Reject")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {student.role === "student" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleRoleUpdate(student.id, "pending", "Block")}
                      >
                        <Ban className="mr-1 h-4 w-4" />
                        Block
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
