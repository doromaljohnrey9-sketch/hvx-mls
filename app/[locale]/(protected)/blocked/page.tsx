import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account Blocked",
  description: "Your account has been blocked.",
  path: "/blocked",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
