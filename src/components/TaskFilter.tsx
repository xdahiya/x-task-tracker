import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardSim } from "lucide-react";
import type { FilterType } from "@/types";

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

type Filter = {
  key: FilterType;
  label: string;
  count: number;
  icon: React.ReactNode;
};

export default function TaskFilter({
  currentFilter,
  onFilterChange,
  taskCounts,
}: TaskFilterProps) {
  const filters: Filter[] = [
    {
      key: "all",
      label: "All",
      count: taskCounts.all,
      icon: <CardSim />,
    },
    {
      key: "pending",
      label: "Pending",
      count: taskCounts.pending,
      icon: <CardSim />,
    },
    {
      key: "completed",
      label: "Completed",
      count: taskCounts.completed,
      icon: <CardSim />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? "default" : "outline"}
          onClick={() => onFilterChange(filter.key)}
          className={`relative ${
            currentFilter === filter.key
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <span className="">{filter.label}</span>
          <Badge
            variant="secondary"
            className={`ml-2 ${
              currentFilter === filter.key
                ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-blue-900"
                : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
            }`}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
