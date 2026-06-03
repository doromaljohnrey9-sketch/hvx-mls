export const PUBLIC_ROUTES = {
  ROOT: "/",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  PENDING: "/pending",
  DENIED: "/denied",
  BLOCKED: "/blocked",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_VIDEOS: "/admin/videos",
  SEARCH: "/search",
  VIDEO: "/videos",
} as const;

export const API_ROUTES = {
  USERS: {
    ME: "/api/users/me",
  },
  ADMIN: {
    STUDENTS: "/api/admin/students",
  },
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
  },
  VIDEOS: "/api/videos",
  BRANCHES: "/api/branches",
  SCHOOLS: "/api/schools",
  EXAM_SETS: "/api/exam-sets",
  SUBJECTS: "/api/subjects",
  MAIL: {
    SEND: "/api/mail/send",
  },
  HEALTHCHECK: "/api/healthcheck",
} as const;

export const PROTECTED_ROUTE_PATTERNS: string[] = Object.values(PROTECTED_ROUTES).map(
  (route) => `${route}/*`
);

export const DEFAULT_AUTH_REDIRECT = PROTECTED_ROUTES.DASHBOARD;

export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN;

export const DEFAULT_PENDING_REDIRECT = PROTECTED_ROUTES.PENDING;

// Admin routes that require teacher+ role
export const ADMIN_ROUTE_PATTERNS = ["/admin/*"] as const;
