import { useTranslations } from "next-intl";

export function ExamSetsPageHeader() {
  const t = useTranslations("ExamSets");

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  );
}
