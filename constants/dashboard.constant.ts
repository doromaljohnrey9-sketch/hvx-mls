export const DASHBOARD_CHART_CONFIG = {
  student: {
    label: "Student",
    color: "#8b5cf6",
  },
  teacher: {
    label: "Teacher",
    color: "#10b981",
  },
  admin: {
    label: "Admin",
    color: "#f59e0b",
  },
  staff: {
    label: "Staff",
    color: "#ef4444",
  },
  pending: {
    label: "Pending",
    color: "#6b7280",
  },
  denied: {
    label: "Denied",
    color: "#6b7280",
  },
  blocked: {
    label: "Blocked",
    color: "#6b7280",
  },
  branch_admin: {
    label: "Branch Admin",
    color: "#f59e0b",
  },
  super_admin: {
    label: "Super Admin",
    color: "#f59e0b",
  },
  none: {
    label: "None",
    color: "#6b7280",
  },
  partial: {
    label: "Partial",
    color: "#f59e0b",
  },
  complete: {
    label: "Complete",
    color: "#10b981",
  },
} as const;

export const DASHBOARD_ROLE_COLOR_MAP: Record<string, string> = {
  student: "#8b5cf6",
  teacher: "#10b981",
  admin: "#f59e0b",
  staff: "#ef4444",
  pending: "#6b7280",
  denied: "#6b7280",
  blocked: "#6b7280",
  branch_admin: "#f59e0b",
  super_admin: "#f59e0b",
};

export const DASHBOARD_STATUS_COLOR_MAP: Record<string, string> = {
  none: "#6b7280",
  partial: "#f59e0b",
  complete: "#10b981",
};
