"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export const PublicFooter = () => {
  const t = useTranslations("Index");

  return (
    <footer className="w-full bg-background pt-16 pb-8 border-t border-border">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center">
        <div className="flex items-start gap-2 mb-8">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="MLS Logo" width={24} height={24} className="rounded-sm" />
              <span className="font-bold text-lg tracking-tight text-foreground leading-none">
                MLS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-12">
          <Link href="/login" className="hover:text-primary transition-colors">
            {t("footer.modules")}
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            {t("footer.privacy")}
          </Link>
        </div>

        <div className="text-center text-[11px] text-muted-foreground w-full pt-4 border-t border-border">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
