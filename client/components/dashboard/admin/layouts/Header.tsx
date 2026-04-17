"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Heart,
  ChevronDown,
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
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";
import { logout } from "@/lib/auth";

interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
  notificationCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuClick,
  isSidebarOpen,
  userName,
  userEmail,
  userAvatar,
  userRole,
  notificationCount = 3,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  return (
    <motion.header
      className="sticky top-0 z-30 w-full bg-white dark:bg-black backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-2 sm:px-4 lg:px-6 w-full justify-between">
        {/* Menu Button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* Page Title - Desktop */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Heart className="h-3 w-3 text-purple-500 fill-purple-500" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden lg:block flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates, questions..."
              className="pl-9 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 w-auto flex-shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <div className="flex cursor-pointer">
            <ThemeToggle  />
          </div>

          {/* Notifications - Desktop Only */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="h-5 w-5" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-[9px] font-medium text-white flex items-center justify-center ring-2 ring-background"
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
                    <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                          {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">New response received</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Menu - Avatar Only on Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center p-0">
                <Avatar className="h-8 w-8 ring-2 ring-indigo-500/20">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xs">
                    {userName ? userName.split(" ").map(n => n[0]).join("") : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{userName || "User"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{userEmail || "user@uog.edu.et"}</span>
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
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-red-600 dark:text-red-400">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};