import { useTranslations } from "next-intl";

export function StudentsPageHeader() {
  const t = useTranslations("StudentManagement");

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
    </div>
  );
}
