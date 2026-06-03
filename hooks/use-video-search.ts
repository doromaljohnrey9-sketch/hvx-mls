"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getVideosQueryOptions } from "@/queries/videos.query";

import type { VideosQueryParams } from "@/types/video.types";

export function useVideoSearch() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolIdFilter, setSchoolIdFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [problemNumberFilter, setProblemNumberFilter] = useState<string>("");

  const queryParams: VideosQueryParams = {
    page,
    pageSize,
    search: searchQuery || undefined,
    schoolId: schoolIdFilter && schoolIdFilter !== "all" ? schoolIdFilter : undefined,
    year: yearFilter && yearFilter !== "all" ? parseInt(yearFilter, 10) : undefined,
    semester: semesterFilter && semesterFilter !== "all" ? parseInt(semesterFilter, 10) : undefined,
    examType: examTypeFilter && examTypeFilter !== "all" ? examTypeFilter : undefined,
    grade: gradeFilter && gradeFilter !== "all" ? parseInt(gradeFilter, 10) : undefined,
    subject: subjectFilter && subjectFilter !== "all" ? subjectFilter : undefined,
    problemNumber: problemNumberFilter ? parseInt(problemNumberFilter, 10) : undefined,
  };

  const videos = useQuery(getVideosQueryOptions(queryParams));

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleSchoolIdFilterChange = (value: string) => {
    setSchoolIdFilter(value);
    setPage(1);
  };

  const handleYearFilterChange = (value: string) => {
    setYearFilter(value);
    setPage(1);
  };

  const handleSemesterFilterChange = (value: string) => {
    setSemesterFilter(value);
    setPage(1);
  };

  const handleExamTypeFilterChange = (value: string) => {
    setExamTypeFilter(value);
    setPage(1);
  };

  const handleGradeFilterChange = (value: string) => {
    setGradeFilter(value);
    setPage(1);
  };

  const handleSubjectFilterChange = (value: string) => {
    setSubjectFilter(value);
    setPage(1);
  };

  const handleProblemNumberFilterChange = (value: string) => {
    setProblemNumberFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = videos.data ? Math.ceil(videos.data.total / pageSize) : 0;

  return {
    videos,
    isLoading: videos.isLoading,
    search: searchInput,
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
  };
}
