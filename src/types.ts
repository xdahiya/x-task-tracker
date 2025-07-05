export  interface Category {
    id: number;
    name: string;
    color: string;
    createdAt: string;
  }


    export interface Task {
      id: number;
      title: string;
      description: string;
      completed: boolean;
      createdAt: string;
      priority?: "low" | "medium" | "high";
      dueDate?: string;
      categories?: string[];
    }
  
    export type FilterType = "all" | "completed" | "pending";
  
    export type SortType =
      | "newest"
      | "oldest"
      | "priority-high"
      | "priority-low"
      | "due-early"
      | "due-late";
