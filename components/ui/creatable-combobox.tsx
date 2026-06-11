"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface CreatableComboboxProps {
  items: { label: string; value: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  onCreateItem?: (label: string) => void;
  placeholder?: string;
  emptyText?: string;
  createText?: string;
  disabled?: boolean;
}

export const CreatableCombobox = React.forwardRef<
  HTMLButtonElement,
  CreatableComboboxProps
>(
  (
    {
      items,
      value,
      onValueChange,
      onCreateItem,
      placeholder = "Select item...",
      emptyText = "No items found.",
      createText = "Create",
      disabled = false,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const selectedItem = items.find((item) => item.value === value);

    // Filter items based on search value
    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    // Check if search value matches any item (for create button visibility)
    const hasExactMatch = items.some(
      (item) =>
        item.label.toLowerCase() === searchValue.toLowerCase() ||
        item.value === searchValue,
    );

    const handleSelect = (selectedValue: string) => {
      onValueChange?.(selectedValue);
      setOpen(false);
      setSearchValue("");
    };

    const handleCreate = () => {
      if (searchValue.trim()) {
        onCreateItem?.(searchValue.trim());
        setSearchValue("");
        setOpen(false);
      }
    };

    return (
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedItem ? selectedItem.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-none"
            />
            <CommandList>
              {filteredItems.length === 0 && searchValue === "" ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
              ) : filteredItems.length === 0 ? (
                <CommandEmpty>
                  <div className="flex flex-col gap-2">
                    {!hasExactMatch && searchValue.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCreate}
                        className="justify-start gap-2 text-left"
                      >
                        <Plus className="size-4" />
                        {createText} "{searchValue}"
                      </Button>
                    )}
                    <p>{emptyText}</p>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === item.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                  {!hasExactMatch &&
                    searchValue.trim() &&
                    filteredItems.length > 0 && (
                      <>
                        <div className="mx-1 my-1 border-t" />
                        <CommandItem onSelect={handleCreate}>
                          <Plus className="mr-2 size-4" />
                          {createText} "{searchValue}"
                        </CommandItem>
                      </>
                    )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
CreatableCombobox.displayName = "CreatableCombobox";
