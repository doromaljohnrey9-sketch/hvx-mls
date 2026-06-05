import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Video Search",
  description: "Search and watch exam solution videos.",
  path: "/search",
  noIndex: true,
});

import { PageClient } from "./page.client";

export default function Page() {
  return <PageClient />;
}
