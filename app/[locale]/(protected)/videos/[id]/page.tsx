import { buildMetadata } from "@/lib/seo";
import { VideoPlayer } from "@/components/videos/video-player";

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

  return <VideoPlayer videoId={id} />;
}
