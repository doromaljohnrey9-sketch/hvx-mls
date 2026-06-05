"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (newLocale: "en" | "ko") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage("en")} disabled={locale === "en"}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage("ko")} disabled={locale === "ko"}>
          한국어
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
