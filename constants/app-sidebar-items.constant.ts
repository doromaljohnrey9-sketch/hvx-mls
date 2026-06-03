import { LayoutDashboardIcon, SearchIcon, UsersIcon, VideoIcon } from "lucide-react";

// HVX Sidebar navigation items
export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "HVX",
    items: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        roles: ["teacher", "branch_admin", "super_admin"], // Only admin roles see dashboard
      },
      {
        name: "Search Videos",
        url: "/search",
        icon: VideoIcon,
        roles: ["student", "teacher", "branch_admin", "super_admin"], // All approved roles
      },
      {
        name: "Students",
        url: "/admin/students",
        icon: UsersIcon,
        roles: ["teacher", "branch_admin", "super_admin"], // Admin only
      },
    ],
  },
  secondary: {
    title: "",
    items: [],
  },
};
