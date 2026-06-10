import { LayoutDashboardIcon, SearchIcon, UsersIcon, VideoIcon, GraduationCap } from "lucide-react";

// MLS Sidebar navigation items
export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "MLS",
    items: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        roles: ["teacher", "super_admin"], // Only admin roles see dashboard
      },
      {
        name: "Search Videos",
        url: "/search",
        icon: VideoIcon,
        roles: ["student", "teacher", "super_admin"], // All approved roles
      },
      {
        name: "Users",
        url: "/admin/users",
        icon: UsersIcon,
        roles: ["teacher", "super_admin"], // Admin only
      },
      {
        name: "Students",
        url: "/admin/students",
        icon: GraduationCap,
        roles: ["teacher", "super_admin"], // Admin only
      },
    ],
  },
  secondary: {
    title: "",
    items: [],
  },
};
