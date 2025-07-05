"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Plus, Edit, Trash2, Check, Settings } from "lucide-react";
import type { Category } from "@/types";


interface CategoryFormProps {
  categories: Category[];
  onAdd: (category: Omit<Category, "id" | "createdAt">) => void;
  onUpdate: (category: Category) => void;
  onDelete: (id: number) => void;
}

const predefinedColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#78716c",
];

export default function CategoryForm({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryFormProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(predefinedColors[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      setError("Category name already exists");
      return;
    }

    onAdd({
      name: newCategoryName.trim(),
      color: newCategoryColor,
    });

    setNewCategoryName("");
    setNewCategoryColor(predefinedColors[0]);
    setError("");
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const handleUpdateCategory = () => {
    if (!editName.trim()) {
      setError("Category name is required");
      return;
    }

    if (
      editingCategory &&
      categories.some(
        (cat) =>
          cat.id !== editingCategory.id &&
          cat.name.toLowerCase() === editName.trim().toLowerCase()
      )
    ) {
      setError("Category name already exists");
      return;
    }

    if (editingCategory) {
      onUpdate({
        ...editingCategory,
        name: editName.trim(),
        color: editColor,
      });
    }

    setEditingCategory(null);
    setEditName("");
    setEditColor("");
    setError("");
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategory(category);
  };

  const confirmDelete = () => {
    if (deleteCategory) {
      onDelete(deleteCategory.id);
      setDeleteCategory(null);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-auto">
            <Settings className="w-4 h-4" />
            <span>Categories</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>manage categores in task manager.you can create, update, delete categories</DialogDescription>
          </DialogHeader>
          <div className="w-full overflow-hidden">
            {/* add new category */}
            <div className="h-[30vh] rounded-lg overflow-hidden">
              <div className="space-y-4">
                <Card className="p-0">
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="Enter category name..."
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setError("");
                    }}
                    
                  />
                </Card>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newCategoryColor === color
                            ? "border-gray-900 dark:border-white"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        <div className="flex w-full h-full items-center justify-center p-2">
                          {newCategoryColor === color && <Check />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}

                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>

            {/* existing categories */}
            <div className="">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Existing Categories ({categories.length})
              </h3>

              {categories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No categories created yet. Add your first category above.
                </p>
              ) : (
                <div className="space-y-2 h-[25vh] overflow-y-scroll scrollbar-hidden">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      {editingCategory?.id === category.id ? (
                        <div className="flex-1 space-y-3 flex flex-col md:flex-row items-center space-x-3">
                          <Input
                            placeholder="category name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            {predefinedColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditColor(color)}
                                className={`w-6 h-6 rounded-full border ${
                                  editColor === color
                                    ? "border-gray-900 dark:border-white"
                                    : "border-gray-300"
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={handleUpdateCategory}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(null);
                                setError("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </span>
                            {/* <Badge variant="secondary" className="text-xs">
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </Badge> */}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                              className=""
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "
              {deleteCategory?.name}"? This will remove the category from all
              tasks that use it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
