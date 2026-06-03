"use client";

import { useState } from "react";
import { useVideoSearch } from "@/hooks/use-video-search";
import { useAuth } from "@/hooks/use-auth";
import { VideosPageHeader } from "@/components/videos/videos-page-header";
import { VideosTable } from "@/components/videos/videos-table";
import { VideosFilters } from "@/components/videos/videos-filters";
import { createVideosColumns } from "@/components/videos/videos-columns";
import { VideoUpdateDialog } from "@/components/videos/video-update-dialog";
import { VideoDeleteDialog } from "@/components/videos/video-delete-dialog";
import type { Video } from "@/types/video.types";

export function VideosPageClient() {
  const { profile } = useAuth();
  const [selectedVideoForUpdate, setSelectedVideoForUpdate] = useState<Video | null>(null);
  const [selectedVideoForDelete, setSelectedVideoForDelete] = useState<Video | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    videos,
    isLoading,
    search,
    schoolIdFilter,
    yearFilter,
    semesterFilter,
    examTypeFilter,
    gradeFilter,
    subjectFilter,
    problemNumberFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleSchoolIdFilterChange,
    handleYearFilterChange,
    handleSemesterFilterChange,
    handleExamTypeFilterChange,
    handleGradeFilterChange,
    handleSubjectFilterChange,
    handleProblemNumberFilterChange,
    handlePageChange,
  } = useVideoSearch();

  const columns = createVideosColumns({
    userRole: profile?.role,
    onUpdate: (video) => {
      setSelectedVideoForUpdate(video);
      setIsUpdateDialogOpen(true);
    },
    onDelete: (video) => {
      setSelectedVideoForDelete(video);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <VideosPageHeader />
      <VideosFilters
        search={search}
        schoolIdFilter={schoolIdFilter}
        yearFilter={yearFilter}
        semesterFilter={semesterFilter}
        examTypeFilter={examTypeFilter}
        gradeFilter={gradeFilter}
        subjectFilter={subjectFilter}
        problemNumberFilter={problemNumberFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSchoolIdFilterChange={handleSchoolIdFilterChange}
        onYearFilterChange={handleYearFilterChange}
        onSemesterFilterChange={handleSemesterFilterChange}
        onExamTypeFilterChange={handleExamTypeFilterChange}
        onGradeFilterChange={handleGradeFilterChange}
        onSubjectFilterChange={handleSubjectFilterChange}
        onProblemNumberFilterChange={handleProblemNumberFilterChange}
      />
      <VideosTable
        columns={columns}
        data={videos.data?.videos ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: videos.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
      {selectedVideoForUpdate && (
        <VideoUpdateDialog
          video={selectedVideoForUpdate}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          key={selectedVideoForUpdate.id}
        />
      )}
      {selectedVideoForDelete && (
        <VideoDeleteDialog
          video={selectedVideoForDelete}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          key={selectedVideoForDelete.id}
        />
      )}
    </div>
  );
}
