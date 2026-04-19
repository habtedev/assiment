"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Building2, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollegeHeader } from "./CollegeHeader";

interface CollegeDashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/college" },
  { icon: Building2, label: "Departments", href: "/dashboard/college/departments" },
  { icon: Settings, label: "Settings", href: "/dashboard/college/settings" },
];

export const CollegeDashboardLayout: React.FC<CollegeDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <CollegeHeader />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">
              College Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => router.push(item.href)}

                >
                  <Icon className="h-5 w-5" />
                  <span className="ml-2">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 ">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CollegeDashboardLayout;
