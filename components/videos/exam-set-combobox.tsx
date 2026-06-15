"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { SelectExamSet } from "@/types/drizzle.types";

type ExamSetWithSchoolName = SelectExamSet & { schoolName?: string };

interface ExamSetComboboxProps {
  examSets: ExamSetWithSchoolName[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  showCreateOption?: boolean;
  createOptionLabel?: string;
  onCreateSelect?: () => void;
  isCreateMode?: boolean;
  disabled?: boolean;
}

function getExamSetLabel(
  examSet: ExamSetWithSchoolName,
  tFilters: (key: string) => string,
  tGrade: (key: string, values: { grade: number }) => string
) {
  return `${examSet.schoolName} - ${examSet.year} ${
    examSet.semester === "1st" ? tFilters("semester1") : tFilters("semester2")
  } ${examSet.examType === "midterm" ? tFilters("midterm") : tFilters("final")} ${tGrade(
    "gradeSuffixShort",
    { grade: examSet.grade }
  )} - ${examSet.subject} - ${examSet.title}`;
}

export function ExamSetCombobox({
  examSets,
  value,
  onValueChange,
  placeholder,
  emptyText,
  showCreateOption = false,
  createOptionLabel,
  onCreateSelect,
  isCreateMode = false,
  disabled = false,
}: ExamSetComboboxProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Videos.management");
  const tFilters = useTranslations("Videos.search.filters");

  const selectedExamSet = examSets.find((examSet) => examSet.id === value);
  const displayLabel = isCreateMode
    ? createOptionLabel
    : selectedExamSet
      ? getExamSetLabel(selectedExamSet, tFilters, t)
      : placeholder ?? t("placeholders.selectExamSet");

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            (!value && !isCreateMode) || disabled ? "text-muted-foreground" : ""
          )}
          disabled={disabled}
        >
          <span className="truncate text-left">{displayLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder ?? t("placeholders.selectExamSet")} />
          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandEmpty>{emptyText ?? t("placeholders.noExamSet")}</CommandEmpty>
            <CommandGroup>
              {showCreateOption && (
                <CommandItem
                  value={createOptionLabel ?? t("placeholders.createExamSet")}
                  onSelect={() => {
                    onCreateSelect?.();
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", isCreateMode ? "opacity-100" : "opacity-0")}
                  />
                  <span className="truncate">{createOptionLabel ?? t("placeholders.createExamSet")}</span>
                </CommandItem>
              )}
              {examSets.map((examSet) => {
                const label = getExamSetLabel(examSet, tFilters, t);

                return (
                  <CommandItem
                    key={examSet.id}
                    value={label}
                    onSelect={() => {
                      onValueChange(examSet.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !isCreateMode && value === examSet.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
