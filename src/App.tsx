import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";

import Login from "@/components/Login";
import { Input } from "./components/ui/input";
import { Button } from "@/components/ui/button";

import {
  getCategories,
  getStoredSortBy,
  getStoredTasks,
  saveCategories,
  setStoredTasks,
  setStoredUser,
} from "@/utils/localStorage";

import CategoryForm from "@/components/CategoriesForm";
import FilterPanel from "@/components/FilterPanel";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import type { Category, FilterType, SortType, Task } from "@/types";
import Header from "./components/Header";
import { Card } from "./components/ui/card";
import { filterAndSortTasks } from "./utils/sortBy";

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  //handle login
  const handleLogin = (username: string) => {
    setStoredUser(username.trim());
    setUser(username);
  };

  //get all task
  useEffect(() => {
    const storedTasks = getStoredTasks();
    setTasks(storedTasks);
  }, []);

  //update new tasks
  useEffect(() => {
    if (tasks.length > 0) {
      setStoredTasks(tasks);
    }
  }, [tasks]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>(getStoredSortBy() || "newest");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const toggleTaskComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setStoredTasks(newTasks);
    setTasks(newTasks);
  };

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const storedCategories = getCategories();
    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      saveCategories(categories);
    }
  }, [categories]);

  const addCategory = (categoryData: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  const deleteCategory = (id: number) => {
    const newCategories = categories.filter((cat) => cat.id !== id);
    saveCategories(newCategories);
    setCategories(newCategories);
    const newTasks = tasks.map((task) => ({
      ...task,
      categories: task.categories?.filter(
        (catName) => categories.find((cat) => cat.id === id)?.name !== catName
      ),
    }));
    setStoredTasks(newTasks);
    setTasks(newTasks);
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredTasks = filterAndSortTasks(
    tasks,
    filter,
    searchTerm,
    sortBy,
    selectedCategories
  );

  return (
    <div className="h-screen transition-colors duration-300">
      {/* header component */}
      <Header user={user} setUser={setUser} />

      {/* dashboard if user logged in else login page */}
      {user ? (
        <div className="h-[80vh] md:h-[90vh] overflow-hidden w-full">
          <div className=" transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="space-y-4">
                <div className="min-h-[10vh] md:min-h-[20vh] w-full overflow-hidden space-y-4">
                  <div className="flex flex-col md:flex-row justify-between w-full">
                    {/* task search input */}
                    <Card className="relative w-full md:w-80 p-0">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </Card>

                    {/* right buttons on desktop */}
                    <div className="hidden md:flex justify-between items-center gap-2">
                      {/* categories form */}
                      <CategoryForm
                        categories={categories}
                        onAdd={addCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                      />

                      {/* tasks form */}
                      <TaskForm
                        open={showTaskForm}
                        setOpen={(state: boolean) => {
                          setShowTaskForm(state);
                        }}
                        task={editingTask}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        categories={categories as any}
                        onSubmit={editingTask ? updateTask : addTask}
                        onCancel={() => {
                          // setEditingTask(null);
                        }}
                      />
                    </div>

                    {/* fileter panel buttons in mobile */}
                    <div className="w-full p-4 flex gap-x-4 flex-row items-center justify-center md:hidden">
                      <CategoryForm
                        categories={categories}
                        onAdd={addCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                      />

                      <TaskForm
                        open={showTaskForm}
                        setOpen={setShowTaskForm}
                        task={editingTask}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        categories={categories as any}
                        onSubmit={editingTask ? updateTask : addTask}
                        onCancel={() => {
                          setShowTaskForm(false);
                          setEditingTask(null);
                        }}
                      />

                      <FilterPanel
                        currentFilter={filter}
                        onFilterChange={setFilter}
                        taskCounts={taskCounts}
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryFilterChange={setSelectedCategories}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                      />
                    </div>
                  </div>

                  {/* filter panel  in desktop */}
                  <div className="hidden md:block">
                    <FilterPanel
                      currentFilter={filter}
                      onFilterChange={setFilter}
                      taskCounts={taskCounts}
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryFilterChange={setSelectedCategories}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                    />
                  </div>
                </div>

                {/* task list */}
                <div className="h-[60vh] md:h-[65vh] overflow-y-scroll w-full scrollbar-hidden">
                  <TaskList
                    tasks={filteredTasks}
                    categories={categories}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={(task: Task) => {
                      setShowTaskForm(true);
                      setEditingTask(task);
                    }}
                    onDelete={deleteTask}
                  />

                  {/* Empty State */}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {searchTerm ? "No tasks found" : "No tasks yet"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by creating your first task"}
                      </p>
                      {!searchTerm && (
                        <Button
                          onClick={() => setShowTaskForm(true)}
                          className=""
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Task
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
