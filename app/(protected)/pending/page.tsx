import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pending Approval",
  description: "Your account is pending approval.",
  path: "/pending",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
