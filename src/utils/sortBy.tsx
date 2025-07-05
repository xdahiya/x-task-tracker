import type { SortType, Task } from "@/types";

export const filterAndSortTasks = (
  tasks: Task[],
  filter: string,
  searchTerm: string,
  sortBy: SortType,
  selectedCategories: string[]
): Task[] => {
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "pending" && !task.completed);

      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.categories &&
          task.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategories =
        selectedCategories.length === 0 ||
        (task.categories &&
          task.categories.some((cat) => selectedCategories.includes(cat)));

      return matchesFilter && matchesSearch && matchesCategories;
    })
    .sort((a, b) => {
      // First sort by completion status (incomplete tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then apply the selected sort
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "priority-high": {
          const priorityOrderHigh = { high: 3, medium: 2, low: 1 };
          const aPriorityHigh = priorityOrderHigh[a.priority || "medium"];
          const bPriorityHigh = priorityOrderHigh[b.priority || "medium"];
          if (aPriorityHigh !== bPriorityHigh) {
            return bPriorityHigh - aPriorityHigh;
          }
          // If same priority, sort by newest
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        case "priority-low": {
          const priorityOrderLow = { high: 1, medium: 2, low: 3 };
          const aPriorityLow = priorityOrderLow[a.priority || "medium"];
          const bPriorityLow = priorityOrderLow[b.priority || "medium"];
          if (aPriorityLow !== bPriorityLow) {
            return bPriorityLow - aPriorityLow;
          }
          // If same priority, sort by newest
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        case "due-early":
          // Tasks with due dates first, then by due date
          if (!a.dueDate && !b.dueDate)
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "due-late":
          // Tasks with due dates first, then by due date (latest first)
          if (!a.dueDate && !b.dueDate)
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return filteredAndSortedTasks;
};

// Sort tasks: incomplete first, then by priority, then by due date, then by creation date

// const sortedTasks = [...tasks].sort((a, b) => {
//   // First, sort by completion status (incomplete first)
//   if (a.completed !== b.completed) {
//     return a.completed ? 1 : -1
//   }

//   // Then by priority (high > medium > low)
//   const priorityOrder = { high: 3, medium: 2, low: 1 }
//   const aPriority = priorityOrder[a.priority || "medium"]
//   const bPriority = priorityOrder[b.priority || "medium"]

//   if (aPriority !== bPriority) {
//     return bPriority - aPriority
//   }

//   // Then by due date (earliest first)
//   if (a.dueDate && b.dueDate) {
//     return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
//   }
//   if (a.dueDate && !b.dueDate) return -1
//   if (!a.dueDate && b.dueDate) return 1

//   // Finally by creation date (newest first)
//   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
// })
