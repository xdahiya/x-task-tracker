import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  getStoredTheme,
  getStoredUser,
  setStoredTheme,
} from "@/utils/localStorage";
import { LogOut, Moon, Sun } from "lucide-react";

function Header({
  user,
  setUser,
}: {
  user: string | null;
  setUser: (username:string|null)=>void;
}) {
  const [darkMode, setDarkMode] = useState(false);

  //hanfle logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    setUser(null);
  };

  //for user state
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    const savedDarkMode = getStoredTheme();
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, [setUser]);

  //for dark-light mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  //toggle dark mdoe
  const toggleDarkMode = () => {
    setStoredTheme(JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
  };

  return (
    <>
      <header className="bg-card h-[10vh] sticky top-0 w-full  shadow-sm border-b ">
        <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12  rounded-full flex items-center justify-center">
                  {/* <User className="w-4 h-4 text-blue-600 dark:text-blue-400" /> */}
                  <img className="w-12 h-12" src="/logo.png" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Task Tracker
                  </h1>
                  {user && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Welcome, {user}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {user && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="bg-gray-50 dark:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
