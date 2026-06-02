export const getQueryKey = {
  users: {
    all: ["users"] as const,
    me: () => [...getQueryKey.users.all, "me"] as const,
  },
  admin: {
    all: ["admin"] as const,
    users: () => [...getQueryKey.admin.all, "users"] as const,
  },
} as const;
