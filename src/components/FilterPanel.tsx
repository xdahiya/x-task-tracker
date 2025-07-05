import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Filter,
  SortAsc,
  Tags,
  X,
  Calendar,
  Flag,
} from "lucide-react";

import type { Category, FilterType, SortType } from "@/types";
import { Card } from "./ui/card";
import { setStoredSortBy } from "@/utils/localStorage";

interface FilterPanelProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
  categories: Category[];
  selectedCategories: string[];
  onCategoryFilterChange: (categories: string[]) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

export default function FilterPanel({
  currentFilter,
  onFilterChange,
  taskCounts,
  categories,
  selectedCategories,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
}: FilterPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All Tasks", count: taskCounts.all },
    { key: "pending", label: "Pending", count: taskCounts.pending },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ];

  const sortOptions: {
    key: SortType;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: "newest", label: "Newest First", icon: Calendar },
    { key: "oldest", label: "Oldest First", icon: Calendar },
    { key: "priority-high", label: "High Priority First", icon: Flag },
    { key: "priority-low", label: "Low Priority First", icon: Flag },
    { key: "due-early", label: "Due Date (Early)", icon: Calendar },
    { key: "due-late", label: "Due Date (Late)", icon: Calendar },
  ];

  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoryFilterChange(
        selectedCategories.filter((cat) => cat !== categoryName)
      );
    } else {
      onCategoryFilterChange([...selectedCategories, categoryName]);
    }
  };

  const clearCategoryFilters = () => {
    onCategoryFilterChange([]);
  };

  const activeFiltersCount =
    selectedCategories.length + (sortBy !== "newest" ? 1 : 0);

  return (
    <>
      {/* desktop filters panel */}
      <div className="hidden md:block w-full">
          <Card className="space-y-4 rounded-lg border shadow-sm p-4">
            {/* status and sorting */}
            <div className="flex items-center justify-between gap-6">
              {/* status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Status:
                  </span>
                </div>
                <div className="flex gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={
                        currentFilter === filter.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => onFilterChange(filter.key)}
                      className={`h-8 ${
                        currentFilter === filter.key
                          ? "bg-primary"
                          : ""
                      }`}
                    >
                      {filter.label}
                      <Badge
                        variant="secondary"
                        className={`ml-2 text-xs ${
                          currentFilter === filter.key
                            ? "bg-primary"
                            : ""
                        }`}
                      >
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* sort options*/}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1">
                  <SortAsc className="w-4 h-4" />
                  <span className="text-sm font-medium 0">
                    Sort:
                  </span>
                </div>
                <Select
                  value={sortBy}
                  onValueChange={(value: SortType) =>{ 
                    onSortChange(value);
                    setStoredSortBy(value);
                  }}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue>
                      {sortOptions.find((option) => option.key === sortBy)
                        ?.label || "Select sort option"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        <span className="flex items-center">
                          <option.icon className="w-4 h-4 mr-2" />
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* categories */}
            {categories.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Tags className="w-4 h-4" />
                  <span className="text-sm font-medium ">
                    Categories:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategories.includes(category.name)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleCategory(category.name)}
                      className={`h-7 text-xs ${
                        selectedCategories.includes(category.name)
                          ? "text-white"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      style={{
                        backgroundColor: selectedCategories.includes(
                          category.name
                        )
                          ? category.color
                          : undefined,
                        borderColor: category.color,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{
                          backgroundColor: selectedCategories.includes(
                            category.name
                          )
                            ? "white"
                            : category.color,
                        }}
                      />
                      {category.name}
                    </Button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCategoryFilters}
                    className="h-7 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            )}
          </Card>
      </div>


      {/* mobile filters dialog panel*/}
      <div className="md:hidden w-full">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative">
              <Button className="ml-auto">
                <Filter className="w-4 h-4" />
              </Button>

              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="-top-2 -right-2 absolute ">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Sort
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <MobileFilterContent
                filters={filters}
                currentFilter={currentFilter}
                onFilterChange={onFilterChange}
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                clearCategoryFilters={clearCategoryFilters}
                sortOptions={sortOptions}
                sortBy={sortBy}
                onSortChange={onSortChange}
                onClose={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

interface MobileFilterContentProps {
  filters: { key: FilterType; label: string; count: number }[];
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryName: string) => void;
  clearCategoryFilters: () => void;
  sortOptions: { key: SortType; label: string; icon: React.ElementType }[];
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  onClose?: () => void;
}

function MobileFilterContent({
  filters,
  currentFilter,
  onFilterChange,
  categories,
  selectedCategories,
  toggleCategory,
  clearCategoryFilters,
  sortOptions,
  sortBy,
  onSortChange,
}: MobileFilterContentProps) {
  return (
    <div className="space-y-6">
      {/* status filter */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={currentFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className={`${
                currentFilter === filter.key
                  ? "bg-primary"
                  : ""
              }`}
            >
              {filter.label}
              <Badge
                variant="secondary"
                className={`ml-2 ${
                  currentFilter === filter.key
                    ? "bg-primary"
                    : ""
                }`}
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/*category filter */}
      {categories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium  flex items-center">
              <Tags className="w-4 h-4 mr-2" />
              Categories
            </h3>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCategoryFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategories.includes(category.name)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => toggleCategory(category.name)}
                className={`${
                  selectedCategories.includes(category.name)
                    ? "text-white"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{
                  backgroundColor: selectedCategories.includes(category.name)
                    ? category.color
                    : undefined,
                  borderColor: category.color,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{
                    backgroundColor: selectedCategories.includes(category.name)
                      ? "white"
                      : category.color,
                  }}
                />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* sort option */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <SortAsc className="w-4 h-4 mr-2" />
          Sort By
        </h3>
        <Select
          value={sortBy}
          onValueChange={(value: SortType) => {
            setStoredSortBy(value);
            onSortChange(value)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {sortOptions.find((option) => option.key === sortBy)?.label ||
                "Select sort option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                <span className="flex items-center">
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
