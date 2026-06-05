import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getVideoByIdQueryOptions } from "@/queries/videos.query";
import { VideoPlayer } from "@/components/videos/video-player";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";

interface VideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = buildMetadata({
  title: "Video",
  description: "Watch exam solution videos.",
  path: "/videos/[id]",
  noIndex: true,
});

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(getVideoByIdQueryOptions(id));
  } catch (error) {
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VideoPlayer videoId={id} />
    </HydrationBoundary>
  );
}
