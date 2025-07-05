import type { Category, SortType, Task } from "@/types"

const TASKS_KEY = "tasks"
const USER_KEY = "username"
const THEME_KEY = "dark-theme"
const CATEGORIES_KEY = "categories"
const SORTBY_KEY = "sortby"

export const getStoredTasks = (): Task[] => {
  if (typeof window === "undefined") return []

  try {
    const tasks = localStorage.getItem(TASKS_KEY)
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export const setStoredTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}

export const getStoredUser = (): string | null => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(USER_KEY)
  } catch (error) {
    console.error("Error loading user from localStorage:", error)
    return null
  }
}

export const setStoredUser = (data:string) => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.setItem(USER_KEY,data)
  } catch (error) {
    console.error("Error settting user in localStorage:", error)
    return null
  }
}

export const getStoredTheme = (): string | null => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(THEME_KEY)
  } catch (error) {
    console.error("Error loading user from localStorage:", error)
    return null
  }
}

export const setStoredTheme = (data:string) => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.setItem(THEME_KEY,data)
  } catch (error) {
    console.error("Error settting theme in localStorage:", error)
    return null
  }
}

export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return []

  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    return categories ? JSON.parse(categories) : []
  } catch (error) {
    console.error("Error loading categories from localStorage:", error)
    return []
  }
}

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  } catch (error) {
    console.error("Error saving categories to localStorage:", error)
  }
}

export const getStoredSortBy = (): SortType | null => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(SORTBY_KEY) as SortType
  } catch (error) {
    console.error("Error loading sortby from localStorage:", error)
    return null
  }
}

export const setStoredSortBy = (data:SortType) => {
  if (typeof window === "undefined") return null

  try {
    return localStorage.setItem(SORTBY_KEY,data)
  } catch (error) {
    console.error("Error settting sortby in localStorage:", error)
    return null
  }
}

