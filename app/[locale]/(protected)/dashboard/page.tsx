import { buildMetadata } from "@/lib/seo";

import { PageClient } from "./page.client";

export const metadata = buildMetadata({
  title: "Dashboard",
  description: "Your dashboard overview.",
  path: "/dashboard",
});

export default function Page() {
  return <PageClient />;
}
