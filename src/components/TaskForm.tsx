/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Flag, Tags, Plus } from "lucide-react";
import type { Task } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface TaskFormProps {
  setOpen: (state: boolean) => void;
  open: boolean;
  task?: Task | null;
  categories: Category[];
  onSubmit: (task: any) => void;
  onCancel: () => void;
}

export default function TaskForm({
  open,
  setOpen,
  task,
  categories,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate || "");
      setSelectedCategories(task.categories || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    formRef.current?.reset();
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      completed: task?.completed || false,
    };

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setSelectedCategories([]);
    setError("");

    if (task) {
      onSubmit({ ...task, ...taskData });
    } else {
      onSubmit(taskData);
    }
    onCancel();
  };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "high":
  //       return "text-red-600 dark:text-red-400"
  //     case "medium":
  //       return "text-yellow-600 dark:text-yellow-400"
  //     case "low":
  //       return "text-green-600 dark:text-green-400"
  //     default:
  //       return "text-gray-600 dark:text-gray-400"
  //   }
  // }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(data) => {
          setOpen(data);
          if (!task) {
            formRef.current?.reset();
            setTitle("");
            setDescription("");
            setPriority("medium");
            setDueDate("");
            setSelectedCategories([]);
            setError("");
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="ml-auto">
            <Plus className="w-4 h-4" />
            <span>{task ? "Edit Task" : "New Task"}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogDescription>
              Make changes to your tasks here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Task Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title..."
                maxLength={30}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                className="w-full scrollbar-hidden"
                // autoFocus
              />
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[100px] overflow-y-scroll resize-none scrollbar-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Flag className="w-4 h-4 mr-1" />
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setPriority(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority">
                      <span className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            priority === "high"
                              ? "bg-red-500"
                              : priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                        Priority
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Low Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Medium Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        High Priority
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dueDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white scroll"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Tags className="w-4 h-4 mr-1" />
                  Categories
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={
                        selectedCategories.includes(category.name)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (selectedCategories.includes(category.name)) {
                          setSelectedCategories(
                            selectedCategories.filter(
                              (cat) => cat !== category.name
                            )
                          );
                        } else {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.name,
                          ]);
                        }
                      }}
                      className={`${
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
                        className="w-2 h-2 rounded-full mr-2"
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
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
