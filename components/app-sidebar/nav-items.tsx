import * as React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

import { useTranslations } from "next-intl";

export const NavItems = ({ title, items, userRole, ...props }: NavItemsProps) => {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  // Filter items based on user role
  const filteredItems = items.filter((item) => {
    if (!item.roles) return true; // No role restriction = show to all
    if (!userRole) return false; // No user role = don't show
    return item.roles.includes(userRole);
  });

  const getLabel = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, "");
    // Fallback to name if key doesn't exist (though it should)
    return t.has(key as any) ? t(key as any) : name;
  };

  return (
    <SidebarGroup {...props}>
      {title && <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild size="sm" isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{getLabel(item.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
