"use client";

import { useVideoSearch } from "@/hooks/use-video-search";
import { VideosPageHeader } from "@/components/videos/videos-page-header";
import { VideosTable } from "@/components/videos/videos-table";
import { VideosFilters } from "@/components/videos/videos-filters";
import { createVideosColumns } from "@/components/videos/videos-columns";

export function VideosPageClient() {
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

  const columns = createVideosColumns();

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
    </div>
  );
}
