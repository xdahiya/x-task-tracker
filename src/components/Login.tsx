import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    onLogin(username.trim());
  };

  return (
    <>
      <div className="overflow-hidden relative w-full h-[90vh] flex justify-center items-center">
        <div className="absolute top-[-200px] left-[-100px] w-[300px] h-[300px] rounded-full bg-primary opacity-30 blur-3xl z-0 pointer-events-none" />

        <div className="absolute top-[-200px] right-[-100px] w-[300px] h-[300px] rounded-full bg-primary opacity-30 blur-3xl z-0 pointer-events-none" />

        <div className="hidden lg:block flex-1/2">
          <div className="flex flex-col w-full justify-center items-center mb-10">
            <h1 className="text-5xl font-black">Focus On.</h1>
            <h1 className="text-6xl cursive font-black">What Matters.</h1>
          </div>

          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
            <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
              <img
                src="/show1-2.png"
                className="dark:hidden h-[156px] md:h-[278px] w-full rounded-lg"
                alt=""
              />
              <img
                src="/show2-2.png"
                className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg"
                alt=""
              />
            </div>
          </div>
          <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
          </div>
        </div>

        <div className="lg:flex-1/2 relative h-[90vh] w-full overflow-hidden flex items-center justify-start md:justify-center p-4 flex-col">
          <Card className="relative z-10 w-full max-w-md shadow-xl  backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-full h-auto rounded-full flex items-center justify-center">
                <img className="" src="/login.png" alt="Login illustration" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="">
                Enter your username to access your personal task tracker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    maxLength={20}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    className="h-12 text-lg"
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
