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
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
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
            Search
          </Button>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <XIcon className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-3">
        <div className="w-full">
          <Select value={schoolIdFilter} onValueChange={onSchoolIdFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {/* TODO: Fetch schools dynamically */}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={yearFilter} onValueChange={onYearFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
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
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="1">1st Semester</SelectItem>
              <SelectItem value="2">2nd Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={examTypeFilter} onValueChange={onExamTypeFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Midterm">Midterm</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="1">Grade 1</SelectItem>
              <SelectItem value="2">Grade 2</SelectItem>
              <SelectItem value="3">Grade 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={subjectFilter} onValueChange={onSubjectFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {/* TODO: Fetch subjects dynamically */}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Input
            placeholder="Problem No."
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
