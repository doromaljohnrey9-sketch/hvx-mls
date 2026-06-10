import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "User Management",
  description: "Approve and manage users.",
  path: "/admin/users",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
