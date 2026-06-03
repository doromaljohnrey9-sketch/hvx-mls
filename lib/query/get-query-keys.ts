export const getQueryKey = {
  users: {
    all: ["users"] as const,
    me: () => [...getQueryKey.users.all, "me"] as const,
  },
  admin: {
    all: ["admin"] as const,
    users: () => [...getQueryKey.admin.all, "users"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  videos: {
    all: ["videos"] as const,
    detail: (id: string) => [...getQueryKey.videos.all, id] as const,
  },
  branches: {
    all: ["branches"] as const,
  },
  schools: {
    all: ["schools"] as const,
  },
  examSets: {
    all: ["exam-sets"] as const,
  },
  subjects: {
    all: ["subjects"] as const,
  },
} as const;
