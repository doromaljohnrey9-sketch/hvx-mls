"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSchoolsQueryOptions } from "@/queries/schools.query";
import { getSubjectsQueryOptions } from "@/queries/subjects.query";
import { VideoUploadDialog } from "@/components/videos/video-upload-dialog";
import { useAuth } from "@/hooks/use-auth";

interface VideosFiltersProps {
  search: string;
  schoolIdFilter: string;
  yearFilter: string;
  semesterFilter: string;
  examTypeFilter: string;
  gradeFilter: string;
  subjectFilter: string;
  problemNumberFilter: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSchoolIdFilterChange: (value: string) => void;
  onYearFilterChange: (value: string) => void;
  onSemesterFilterChange: (value: string) => void;
  onExamTypeFilterChange: (value: string) => void;
  onGradeFilterChange: (value: string) => void;
  onSubjectFilterChange: (value: string) => void;
  onProblemNumberFilterChange: (value: string) => void;
}

import { useTranslations } from "next-intl";

export function VideosFilters({
  search,
  schoolIdFilter,
  yearFilter,
  semesterFilter,
  examTypeFilter,
  gradeFilter,
  subjectFilter,
  problemNumberFilter,
  onSearchChange,
  onSearchSubmit,
  onSchoolIdFilterChange,
  onYearFilterChange,
  onSemesterFilterChange,
  onExamTypeFilterChange,
  onGradeFilterChange,
  onSubjectFilterChange,
  onProblemNumberFilterChange,
}: VideosFiltersProps) {
  const { data: schools, isLoading: schoolsLoading } = useQuery(getSchoolsQueryOptions());
  const { data: subjects, isLoading: subjectsLoading } = useQuery(getSubjectsQueryOptions());
  const { profile } = useAuth();
  const t = useTranslations("Videos.search");

  const canUploadVideo = profile?.role === "teacher" || profile?.role === "super_admin";

  const hasActiveFilters =
    (schoolIdFilter && schoolIdFilter !== "all") ||
    (yearFilter && yearFilter !== "all") ||
    (semesterFilter && semesterFilter !== "all") ||
    (examTypeFilter && examTypeFilter !== "all") ||
    (gradeFilter && gradeFilter !== "all") ||
    (subjectFilter && subjectFilter !== "all") ||
    problemNumberFilter;

  const clearFilters = () => {
    onSchoolIdFilterChange("all");
    onYearFilterChange("all");
    onSemesterFilterChange("all");
    onExamTypeFilterChange("all");
    onGradeFilterChange("all");
    onSubjectFilterChange("all");
    onProblemNumberFilterChange("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("placeholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit();
              }
            }}
            className="pl-9 pr-20"
          />
          <Button
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            onClick={onSearchSubmit}
          >
            {t("search")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="whitespace-nowrap">
              <XIcon className="size-4 mr-2" />
              {t("clearFilters")}
            </Button>
          )}
          {canUploadVideo && <VideoUploadDialog />}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-3">
        <div className="w-full">
          <Select
            value={schoolIdFilter}
            onValueChange={onSchoolIdFilterChange}
            disabled={schoolsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allSchools")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allSchools")}</SelectItem>
              {schools?.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={yearFilter} onValueChange={onYearFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allYears")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allYears")}</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={semesterFilter} onValueChange={onSemesterFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allSemesters")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allSemesters")}</SelectItem>
              <SelectItem value="1st">{t("filters.semester1")}</SelectItem>
              <SelectItem value="2nd">{t("filters.semester2")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={examTypeFilter} onValueChange={onExamTypeFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allExamTypes")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allExamTypes")}</SelectItem>
              <SelectItem value="midterm">{t("filters.midterm")}</SelectItem>
              <SelectItem value="final">{t("filters.final")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allGrades")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allGrades")}</SelectItem>
              <SelectItem value="1">{t("filters.grade1")}</SelectItem>
              <SelectItem value="2">{t("filters.grade2")}</SelectItem>
              <SelectItem value="3">{t("filters.grade3")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select
            value={subjectFilter}
            onValueChange={onSubjectFilterChange}
            disabled={subjectsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.allSubjects")} className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allSubjects")}</SelectItem>
              {subjects?.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Input
            placeholder={t("filters.problemNo")}
            value={problemNumberFilter}
            onChange={(e) => onProblemNumberFilterChange(e.target.value)}
            className="w-full"
            type="number"
          />
        </div>
      </div>
    </div>
  );
}
