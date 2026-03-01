"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  Maximize2,
  Minimize2,
  LogOut,
  Heart,
  Shield,
  GraduationCap,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";

interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuClick,
  isSidebarOpen,
  userName = "Dr. Abebe Kebede",
  userEmail = "abebe.kebede@uog.edu.et",
  userAvatar,
  notificationCount = 3,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const pathname = usePathname();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  const handleThemeToggle = () => {
    // Theme toggle handled globally via shared header
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-800/50 shadow-lg"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-amber-200/30 dark:border-amber-800/30"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center gap-2 sm:gap-4 px-2 sm:px-6 w-full justify-between">
        {/* Menu Button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Mobile (hidden on mobile) */}
        <div className="hidden sm:flex lg:hidden items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-600 rounded-lg blur opacity-40" />
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
          <span className="font-semibold text-sm">UoG Admin</span>
        </div>

        {/* Page Title - Desktop */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden sm:block flex-1 max-w-md mx-auto">
          <div className={cn(
            "relative transition-all duration-300",
            searchFocused && "scale-105"
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, questions... (⌘K)"
              className="pl-9 pr-4 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 w-auto flex-shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />
          {/* Online/Offline Toggle */}
          <button
            onClick={() => setIsOnline((prev) => !prev)}
            className={cn(
              "hidden sm:flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium transition-colors",
              isOnline
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300",
              "focus:outline-none focus:ring-2 focus:ring-amber-500"
            )}
            aria-label={isOnline ? "Set offline" : "Set online"}
          >
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full mr-1",
                isOnline ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
            <span className="hidden xs:inline">{isOnline ? "Online" : "Offline"}</span>
            <span className="inline xs:hidden">{isOnline ? "On" : "Off"}</span>
          </button>
          {/* Campus Badge */}
          {/* Removed Semester II • 2025/26 badge */}

          {/* Fullscreen Toggle - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 hidden lg:flex"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {/* Theme Toggle (always visible) */}
          <div className="flex cursor-pointer">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30">
                <Bell className="h-5 w-5" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[9px] font-medium text-white flex items-center justify-center ring-2 ring-background"
                >
                  {notificationCount}
                </motion.span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="outline" className="rounded-full text-xs">
                  {notificationCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                        {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">New response received</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-xs text-muted-foreground hover:text-amber-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 pl-1 pr-3 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 hidden sm:flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-amber-500/30">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white">
                    {userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 text-rose-600">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Bar - Like Login Page */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-amber-500 to-rose-500"
        initial={{ width: "0%" }}
        animate={{ width: "65%" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.header>
  );
};