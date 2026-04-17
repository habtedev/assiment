"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./Sidebar";
import { AdminHeader } from "./Header";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Heart, Shield, Sparkles, Zap, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { getUserData } from "@/lib/auth";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  // Handle mounting and authentication check
  useEffect(() => {
    setMounted(true);
    // Fetch user data from localStorage
    const user = getUserData();
    if (user) {
      setUserData(user);
    } else {
      // Redirect to login if not authenticated
      router.push("/");
    }
  }, [router]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "🟢 Back Online",
        description: "Your connection has been restored.",
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "🔴 Offline",
        description: "You are currently offline. Some features may be unavailable.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
        toast({
          title: sidebarOpen ? "Sidebar Closed" : "Sidebar Opened",
          duration: 1000,
        });
      }
      // F11 to toggle fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, toast]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      toast({
        title: "Fullscreen Mode",
        description: "Press F11 or ESC to exit",
        duration: 2000,
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [toast]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="flex flex-col gap-6 items-center">
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University Logo"
              className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-black"
              style={{ background: '#fff' }}
            />
            <div className="flex gap-4 items-center w-full justify-center">
              <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
            className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-100/20 to-purple-100/20 dark:from-indigo-900/10 dark:to-purple-900/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>


      {/* Fullscreen Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="fixed bottom-4 right-4 z-60 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all hidden lg:flex"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)} 
          />
        </div>

        {/* Mobile Sidebar with Sheet */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
              <AdminSidebar 
                isOpen={true} 
                onToggle={() => setIsMobileMenuOpen(false)}
                isMobile 
                onMobileClose={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content Area */}
        <motion.div
          className="flex-1 flex flex-col h-full overflow-hidden"
          animate={{ 
            marginLeft: sidebarOpen && !isMobileMenuOpen ? 0 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <AdminHeader
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
            userName={userData?.name}
            userEmail={userData?.email}
            userAvatar={userData?.avatar}
            userRole={userData?.role}
          />

          {/* Scroll Progress Indicator */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ scaleX: isScrolled ? 1 : 0, transformOrigin: "0%" }}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">


              {/* Page Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {children}
              </motion.div>
            </div>
          </main>

          {/* Enhanced Footer */}
          <footer className={cn(
            "border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm py-3 px-4 md:px-6 transition-all",
            isScrolled && "shadow-lg"
          )}>
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-purple-500 fill-purple-500" />
                  <span>© 2026 University of Gondar</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Teacher Assessment System v3.0</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Secure Portal</span>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">System Online</span>
                </div>
              </div>

              {/* Quick Stats - Mobile */}
              <div className="flex md:hidden items-center gap-2 text-[10px]">
                <span>Templates: 12</span>
                <span>•</span>
                <span>Responses: 1.2k</span>
              </div>
            </div>

            {/* Progress Bar - Shows system load */}
            <div className="mt-2 md:hidden">
              <Progress value={65} className="h-1" />
            </div>
          </footer>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-60 hidden lg:block"
      >
        <Badge variant="outline" className="rounded-full px-3 py-1.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 gap-2">
          <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">⌘B</kbd>
          <span className="text-xs">Toggle sidebar</span>
          <span className="w-1 h-1 rounded-full bg-indigo-300" />
          <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">F11</kbd>
          <span className="text-xs">Fullscreen</span>
        </Badge>
      </motion.div>

      <Toaster />
    </div>
  );
};

export default AdminDashboardLayout;