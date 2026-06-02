import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Student Management",
  description: "Approve and manage students.",
  path: "/admin/students",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
