"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "./Sidebar";
import { StudentHeader } from "./header";
// import { Rightbar } from "./Rightbar";
import { MobileNav } from "./mobileNav";
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

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  onTemplateSelect?: (template: any) => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children, onTemplateSelect }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { theme } = useTheme();
  const { toast } = useToast();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="flex flex-col gap-6 items-center">
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University Logo"
              className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-900"
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
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-gradient-to-r from-amber-200/40 to-rose-200/40 dark:from-amber-900/20 dark:to-rose-900/20 blur-3xl"
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
          className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-r from-amber-200/40 to-rose-200/40 dark:from-amber-900/20 dark:to-rose-900/20 blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-amber-100/20 to-rose-100/20 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl"
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
        className="fixed bottom-4 right-4 z-[60] rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all hidden lg:flex"
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
            onTemplateSelect={onTemplateSelect}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Mobile Sidebar with Sheet */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all"
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
          <StudentHeader 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            isSidebarOpen={sidebarOpen} 
          />

          {/* Scroll Progress Indicator */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-amber-500 to-rose-500"
            style={{ scaleX: isScrolled ? 1 : 0, transformOrigin: "0%" }}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 dark:from-amber-500/5 dark:to-rose-500/5 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-600 rounded-full blur-md opacity-40 animate-pulse" />
                    <Sparkles className="relative h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium">Welcome back, student</h2>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>System Ready</span>
                  </Badge>
                </div>
              </motion.div>

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

          {/* Rightbar */}
          {/* <Rightbar /> */}

          {/* Enhanced Footer */}
          <footer className={cn(
            "border-t border-amber-200/50 dark:border-amber-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-3 px-4 md:px-6 transition-all",
            isScrolled && "shadow-lg"
          )}>
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                  <span>© 2026 University of Gondar</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Teacher Assessment System v3.0</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-amber-500" />
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
        className="fixed bottom-4 left-4 z-[60] hidden lg:block"
      >
      </motion.div>

      <Toaster />
    </div>
  );
};

export default AdminDashboardLayout;