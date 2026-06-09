"use client";

import { useTranslations } from "next-intl";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/app-sidebar/nav-user";

import { NavItems } from "./nav-items";

import { APP_SIDEBAR_ITEMS } from "@/constants/app-sidebar-items.constant";

import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();
  const t = useTranslations("Sidebar");

  const { profile, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.invalidateQueries({ queryKey: getQueryKey.users.me() });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error(t("logoutFailed"), { description: t("tryAgain") }); // I should add these keys
    }
  };

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/logo.png" alt="MLS Logo" width={32} height={32} className="size-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t("platform")}</span>
                  <span className="truncate text-xs">{t("tagline")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItems {...APP_SIDEBAR_ITEMS.platform} userRole={profile?.role} />
        <NavItems {...APP_SIDEBAR_ITEMS.secondary} className="mt-auto" userRole={profile?.role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={profile} handleSignOut={handleSignOut} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
};
