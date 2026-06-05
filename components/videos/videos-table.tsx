"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface VideosTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

import { useTranslations } from "next-intl";

export function VideosTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
}: VideosTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const t = useTranslations("Videos.table");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-md border">
      <div className="min-w-0">
        <Table style={{ minWidth: table.getTotalSize() }} className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const headerDef = header.column.columnDef.header;

                  const headerContent = header.isPlaceholder ? null : typeof headerDef ===
                      "string" && canSort ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left text-sm font-semibold text-foreground"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {headerDef}
                      <span className="opacity-60">
                        {sorted === "asc" ? (
                           <ChevronUpIcon className="size-4" />
                        ) : sorted === "desc" ? (
                          <ChevronDownIcon className="size-4" />
                        ) : (
                          <ChevronUpIcon className="size-4 opacity-0" />
                        )}
                      </span>
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  );

                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.column.columnDef.size
                          ? `${header.column.columnDef.size}px`
                          : undefined,
                      }}
                      className={`${typeof headerDef === "string" && canSort ? "cursor-pointer select-none" : ""} overflow-hidden shrink-0`}
                      onClick={
                        typeof headerDef === "string" && canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {headerContent}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(columns.length)].map((_, j) => (
                    <TableCell key={j} className="h-16">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.columnDef.size
                          ? `${cell.column.columnDef.size}px`
                          : undefined,
                      }}
                      className="h-16 overflow-hidden shrink-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <span className="text-muted-foreground font-medium">{t("noVideos")}</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="text-sm text-muted-foreground font-medium">
            {t("showing", {
              start: (pagination.page - 1) * pagination.pageSize + 1,
              end: Math.min(pagination.page * pagination.pageSize, pagination.total),
              total: pagination.total,
            })}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3"
            >
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:inline">{t("previous")}</span>
            </Button>
            <div className="text-sm text-foreground font-medium whitespace-nowrap">
              {t("pageOf", { page: pagination.page, totalPages: pagination.totalPages })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3"
            >
              <span className="hidden sm:inline">{t("next")}</span>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
