"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { Menu, X, LogOut, User, BookOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TeacherDashboardLayoutProps {
  children: React.ReactNode;
}

export const TeacherDashboardLayout: React.FC<TeacherDashboardLayoutProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/login');
    toast({ title: "Logged out", description: "You have been logged out successfully" });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <span className="font-bold">Teacher Portal</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="font-bold">Teacher Portal</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Link href="/dashboard/teacher/responses" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Student Responses</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-40 bg-white dark:bg-gray-800 border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
        "hidden lg:block"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            {sidebarOpen && <span className="font-bold">Teacher Portal</span>}
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/dashboard/teacher/responses" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              {sidebarOpen && <span>Student Responses</span>}
            </div>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button onClick={handleLogout} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span>Logout</span>}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300",
        "lg:ml-64",
        "pt-16 lg:pt-0"
      )}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
