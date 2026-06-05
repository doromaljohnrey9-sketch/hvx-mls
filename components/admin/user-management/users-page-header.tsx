import { useTranslations } from "next-intl";

export function UsersPageHeader() {
  const t = useTranslations("UserManagement");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>
    </div>
  );
}
