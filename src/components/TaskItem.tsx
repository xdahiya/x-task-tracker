import { useState } from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Flag,
  Clock,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Category, Task } from "@/types";

interface TaskItemProps {
  task: Task;
  categories?: Category[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  categories,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: "text-red-600 dark:text-red-400",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        color: "text-orange-600 dark:text-orange-400",
      };
    } else if (diffDays === 1) {
      return {
        text: "Due tomorrow",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    } else {
      return {
        text: `Due in ${diffDays} days`,
        color: "text-gray-600 dark:text-gray-400",
      };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    const baseClass = "w-3 h-3";
    switch (priority) {
      case "high":
        return <Flag className={`${baseClass} text-red-600`} />;
      case "medium":
        return <Flag className={`${baseClass} text-yellow-600`} />;
      case "low":
        return <Flag className={`${baseClass} text-green-600`} />;
      default:
        return <Flag className={`${baseClass} text-gray-600`} />;
    }
  };

  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxLength = 100;
  const isLongDescription =
    task.description && task.description.length > maxLength;
  const visibleDescription =
    showFullDescription || !isLongDescription
      ? task.description
      : `${task.description?.slice(0, maxLength)}...`;

  return (
    <>
    <Card
       className={`rounded-lg shadow-sm border p-4 transition-all duration-200 hover:shadow-md ${
          task.completed ? "opacity-75" : ""
        }`}
    >
      <div
     
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    task.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <div className="w-full overflow-x-scroll mt-1  text-sm text-gray-600 scrollbar-hidden dark:text-gray-300">
                    <p
                      className={`max-w-[30vw] whitespace-pre-wrap text-ellipsis  ${
                        task.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : ""
                      }`}
                    >
                      {visibleDescription}
                    </p>
                    {isLongDescription && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-blue-600 dark:text-blue-400 text-xs mt-1 underline"
                      >
                        {showFullDescription ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {/* Priority Badge */}
                  {task.priority && (
                    <Badge
                      variant="secondary"
                      className={`${getPriorityColor(task.priority)} text-xs`}
                    >
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  )}

                  {/* Categories */}
                  {task.categories && task.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.categories.map((categoryName) => {
                        // Find the category to get its color
                        const category = categories?.find(
                          (cat) => cat.name === categoryName
                        );
                        return (
                          <Badge
                            key={categoryName}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: category?.color || "#64748b",
                              color: category?.color || "#64748b",
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full mr-1"
                              style={{
                                backgroundColor: category?.color || "#64748b",
                              }}
                            />
                            {categoryName}
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Due Date */}
                  {task.dueDate && dueDateInfo && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${dueDateInfo.color}`}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {dueDateInfo.text}
                    </Badge>
                  )}

                  {/* Created Date */}
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

    </Card>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(task.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
