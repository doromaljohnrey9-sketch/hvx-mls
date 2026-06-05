import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account Denied",
  description: "Your account registration has been denied.",
  path: "/denied",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
