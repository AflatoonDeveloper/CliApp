"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Camera,
  History,
  BarChart3,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold text-green-600">
            NutriAI
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard") && !isActive("/dashboard/upload") && !isActive("/dashboard/history") && !isActive("/dashboard/insights") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard/upload") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Analyze Food
            </Link>
            <Link
              href="/dashboard/history"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard/history") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              History
            </Link>
            <Link
              href="/dashboard/insights"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard/insights") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Insights
            </Link>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                  router.push("/sign-in");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center py-2"
          >
            <Home
              className={`h-5 w-5 ${isActive("/dashboard") && !isActive("/dashboard/upload") && !isActive("/dashboard/history") && !isActive("/dashboard/insights") ? "text-green-600" : "text-gray-500"}`}
            />
            <span
              className={`text-xs mt-1 ${isActive("/dashboard") && !isActive("/dashboard/upload") && !isActive("/dashboard/history") && !isActive("/dashboard/insights") ? "text-green-600 font-medium" : "text-gray-500"}`}
            >
              Home
            </span>
          </Link>

          <Link
            href="/dashboard/upload"
            className="flex flex-col items-center justify-center py-2"
          >
            <Camera
              className={`h-5 w-5 ${isActive("/dashboard/upload") ? "text-green-600" : "text-gray-500"}`}
            />
            <span
              className={`text-xs mt-1 ${isActive("/dashboard/upload") ? "text-green-600 font-medium" : "text-gray-500"}`}
            >
              Analyze
            </span>
          </Link>

          <Link
            href="/dashboard/history"
            className="flex flex-col items-center justify-center py-2"
          >
            <History
              className={`h-5 w-5 ${isActive("/dashboard/history") ? "text-green-600" : "text-gray-500"}`}
            />
            <span
              className={`text-xs mt-1 ${isActive("/dashboard/history") ? "text-green-600 font-medium" : "text-gray-500"}`}
            >
              History
            </span>
          </Link>

          <Link
            href="/dashboard/insights"
            className="flex flex-col items-center justify-center py-2"
          >
            <BarChart3
              className={`h-5 w-5 ${isActive("/dashboard/insights") ? "text-green-600" : "text-gray-500"}`}
            />
            <span
              className={`text-xs mt-1 ${isActive("/dashboard/insights") ? "text-green-600 font-medium" : "text-gray-500"}`}
            >
              Insights
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
