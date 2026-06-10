export const DASHBOARD_CHART_CONFIG = {
  student: {
    color: "#8b5cf6",
  },
  teacher: {
    color: "#10b981",
  },
  admin: {
    color: "#f59e0b",
  },
  staff: {
    color: "#ef4444",
  },
  pending: {
    color: "#6b7280",
  },
  denied: {
    color: "#6b7280",
  },
  blocked: {
    color: "#6b7280",
  },
  super_admin: {
    color: "#f59e0b",
  },
  none: {
    color: "#6b7280",
  },
  partial: {
    color: "#f59e0b",
  },
  complete: {
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
  super_admin: "#f59e0b",
};

export const DASHBOARD_STATUS_COLOR_MAP: Record<string, string> = {
  none: "#6b7280",
  partial: "#f59e0b",
  complete: "#10b981",
};
