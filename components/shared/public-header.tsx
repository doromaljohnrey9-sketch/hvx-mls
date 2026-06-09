"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";

import { useAuth } from "@/hooks/use-auth";

export const PublicHeader = () => {
  const { user } = useAuth();
  const t = useTranslations("Index");

  return (
    <nav className="w-full bg-card max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="MLS Logo" width={32} height={32} className="rounded-sm" />
            <span className="font-bold text-xl tracking-tight text-foreground">MLS</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        {user ? (
          <Link href="/dashboard">
            <Button className="rounded-full px-5 py-2.5">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden sm:block text-foreground border border-border px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
            >
              {t("hero.login")}
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-5 py-2.5">{t("hero.signup")}</Button>
            </Link>
          </>
        )}
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
};
