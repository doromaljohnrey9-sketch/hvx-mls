import * as React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItemsProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  title?: string;
  items: readonly {
    name: string;
    url: string;
    icon: LucideIcon;
    roles?: string[];
  }[];
  userRole?: string;
}

export const NavItems = ({ title, items, userRole, ...props }: NavItemsProps) => {
  // Filter items based on user role
  const filteredItems = items.filter((item) => {
    if (!item.roles) return true; // No role restriction = show to all
    if (!userRole) return false; // No user role = don't show
    return item.roles.includes(userRole);
  });

  return (
    <SidebarGroup {...props}>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
