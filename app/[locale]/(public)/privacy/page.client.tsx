"use client";

import { useTranslations } from "next-intl";

import { PublicHeader } from "@/components/shared/public-header";
import { PublicFooter } from "@/components/shared/public-footer";

export const PrivacyPageClient = () => {
  const t = useTranslations("Privacy");

  return (
    <div className="min-h-screen bg-muted/50 text-foreground flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mb-12 text-sm">{t("lastUpdated")}</p>

          <div className="flex flex-col gap-12">
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("intro.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("intro.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("collection.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("collection.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("usage.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("usage.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("sharing.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("sharing.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("security.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("security.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("rights.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("rights.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("cookies.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("cookies.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("changes.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("changes.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                {t("contact.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("contact.content")}</p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
