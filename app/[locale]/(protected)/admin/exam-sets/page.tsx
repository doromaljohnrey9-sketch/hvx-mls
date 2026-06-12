import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Exam Set Management",
  description: "Manage exam sets for assessments.",
  path: "/admin/exam-sets",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
