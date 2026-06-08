"use client";

import { useQuery } from "@tanstack/react-query";
import { getVideoByIdQueryOptions } from "@/queries/videos.query";
import { getPublicUrlSync } from "@/lib/supabase/storage.client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toSentenceCase } from "@/lib/utils";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
  GraduationCapIcon,
  HashIcon,
  MoonIcon,
  PlayIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Default Supabase Storage bucket for exam videos
const DEFAULT_VIDEO_BUCKET = "exams";

interface VideoPlayerProps {
  videoId: string;
}

function MetaRow({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-3.5 shrink-0">{icon}</span>
        {label}
      </span>
      {badge ?? <span className="text-sm font-medium text-foreground">{value}</span>}
    </div>
  );
}

import { useTranslations } from "next-intl";

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const router = useRouter();
  const t = useTranslations("Videos.player");
  const tFilters = useTranslations("Videos.search.filters");
  const tManagement = useTranslations("Videos.management");
  const { data: video, isLoading, error } = useQuery(getVideoByIdQueryOptions(videoId));

  const resolvedVideoUrl = video
    ? video.filePath
      ? getPublicUrlSync(DEFAULT_VIDEO_BUCKET, video.filePath)
      : video.videoUrl
    : undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-full bg-destructive/10">
          <PlayIcon className="size-6 text-destructive" />
        </div>
        <div className="text-center flex flex-col gap-1">
          <p className="font-medium text-destructive">{t("failed")}</p>
          {error && <p className="text-sm text-muted-foreground">{String(error)}</p>}
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeftIcon className="size-4 mr-2" />
          {t("goBack")}
        </Button>
      </div>
    );
  }

  const isYouTube =
    resolvedVideoUrl?.includes("youtube.com") || resolvedVideoUrl?.includes("youtu.be");

  const isGoogleDrive = resolvedVideoUrl?.includes("drive.google.com");

  const getDriveEmbedUrl = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const embedUrl = isYouTube
    ? resolvedVideoUrl?.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
    : isGoogleDrive
      ? getDriveEmbedUrl(resolvedVideoUrl!)
      : undefined;

  const translatedSemester =
    video.examSet.semester === "1st" ? tFilters("semester1") : tFilters("semester2");

  const translatedExamType =
    video.examSet.examType === "midterm" ? tFilters("midterm") : tFilters("final");

  const translatedVisibility = tManagement(`options.${video.visibility}`);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 mr-2" />
        {t("back")}
      </Button>

      {/* Title + subtitle */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          {video.title || `${t("problem")} ${video.problemNumber}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {video.examSet.school.name} · {video.examSet.year} · {translatedSemester} ·{" "}
          {translatedExamType}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-5 items-start">
        {/* Left — video */}
        <div>
          <div className="aspect-video w-full min-h-[360px] bg-primary-foreground rounded-xl overflow-hidden border border-border/60 shadow-none">
            {isYouTube || isGoogleDrive ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={resolvedVideoUrl}
                className="w-full h-full bg-primary-foreground"
                controls
                onError={(e) => console.error("Video error:", e)}
              />
            )}
          </div>
        </div>

        {/* Right — sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Exam details card */}
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("examDetails")}
              </p>
            </div>
            <div className="px-4 py-1">
              <MetaRow
                icon={<BuildingIcon className="size-3.5" />}
                label={t("labels.school")}
                value={video.examSet.school.name}
              />
              <MetaRow
                icon={<CalendarIcon className="size-3.5" />}
                label={t("labels.year")}
                value={video.examSet.year.toString()}
              />
              <MetaRow
                icon={<MoonIcon className="size-3.5" />}
                label={t("labels.semester")}
                value={translatedSemester}
              />
              <MetaRow
                icon={<FileTextIcon className="size-3.5" />}
                label={t("labels.examType")}
                value={translatedExamType}
              />
              <MetaRow
                icon={<GraduationCapIcon className="size-3.5" />}
                label={t("labels.grade")}
                value={t("gradeSuffix", { grade: video.examSet.grade })}
              />
              <MetaRow
                icon={<BookOpenIcon className="size-3.5" />}
                label={t("labels.subject")}
                value={video.examSet.subject}
              />
              <MetaRow
                icon={<HashIcon className="size-3.5" />}
                label={t("labels.problemNo")}
                value={video.problemNumber.toString()}
              />
              <MetaRow
                icon={<EyeIcon className="size-3.5" />}
                label={t("labels.visibility")}
                badge={
                  <Badge
                    variant={video.visibility === "public" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {translatedVisibility}
                  </Badge>
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
