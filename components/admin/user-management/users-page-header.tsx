import { useTranslations } from "next-intl";
import { UserCreateDialog } from "./user-create-dialog";

export function UsersPageHeader({ onCreateUser }: { onCreateUser: (data: any) => void }) {
  const t = useTranslations("UserManagement");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <UserCreateDialog onCreateUser={onCreateUser} />
    </div>
  );
}
