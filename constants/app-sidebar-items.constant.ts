import {
  LayoutDashboardIcon,
  SearchIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

// HVX Sidebar navigation items
export const APP_SIDEBAR_ITEMS = {
  platform: {
    title: "HVX",
    items: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        name: "Search Videos",
        url: "/dashboard/search",
        icon: SearchIcon,
      },
    ],
  },
  drawer: {
    title: "Management",
    items: [
      {
        title: "Students",
        url: "/admin/students",
        icon: UsersIcon,
        isActive: false,
        subItems: [
          { title: "Student List", url: "/admin/students" },
        ],
      },
      {
        title: "Videos",
        url: "/admin/videos",
        icon: VideoIcon,
        subItems: [
          { title: "All Videos", url: "/admin/videos" },
          { title: "Add Video", url: "/admin/videos/new" },
        ],
      },
    ],
  },
  secondary: {
    title: "",
    items: [],
  },
};
