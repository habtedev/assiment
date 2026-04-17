"use client";

import React, { useCallback, useMemo, memo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Sun,
  Moon,
  Heart,
  Shield,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import SidebarTemplatesCollapse from "./SidebarTemplatesCollapse";
import { useTranslation } from "react-i18next";
import { logout } from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

const MOCK_NOTIFICATIONS = 3;

export const AdminSidebar: React.FC<SidebarProps> = memo(({
  isOpen,
  onToggle,
  onMobileClose,
  isMobile = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = useMemo(() => [
    {
      title: t('dashboard.title', 'Dashboard'),
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: t('sidebar.colleges', 'Colleges'),
      href: "/dashboard/admin/colleges",
      icon: Building2,
      badge: 8,
      badgeColor: "bg-purple-500",
    },
    {
      title: t('dashboard.settings', 'Settings'),
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ], [t]);

  const isActiveRoute = useCallback((href: string) => {
    if (href === "/dashboard/admin") return pathname === href;
    return pathname.startsWith(href);
  }, [pathname]);

  const handleNavigation = useCallback((href: string) => {
    if (isMobile && onMobileClose) onMobileClose();
    router.push(href);
  }, [isMobile, onMobileClose, router]);

  const handleLogout = useCallback(() => {
    logout();
    toast({ title: "Logged out successfully" });
    router.push("/");
  }, [toast, router]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <motion.aside
      animate={{ width: isOpen ? 280 : 76 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-full bg-white dark:bg-black flex flex-col relative overflow-hidden",
        "border-r border-gray-200 dark:border-gray-800"
      )}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Logo Section */}
      <div className={cn("px-6 py-5 border-b border-gray-200 dark:border-gray-800", !isOpen && "px-4")}>
        <div className={cn("flex items-center", isOpen ? "gap-3" : "justify-center")}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-30" />
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University Logo"
              className="relative h-10 w-10 rounded-xl object-cover shadow-md ring-2 ring-gray-100 dark:ring-gray-800"
            />
          </div>

          {isOpen && (
            <div className="flex flex-col flex-1">
              <span className="font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                University of Gondar
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <Heart className="h-3 w-3 text-purple-500" /> Assessment
              </span>
            </div>
          )}

          {/* Toggle Button (Desktop) */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <SidebarTemplatesCollapse isSidebarOpen={isOpen} />

        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm",
                      !isOpen && "justify-center px-3",
                      isActive
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-indigo-600 dark:text-indigo-400")} />

                    {isOpen && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge className={cn("text-[10px] h-5 px-2 font-medium", item.badgeColor)}>
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}

                    {!isOpen && isActive && (
                      <div className="absolute left-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </Link>
                </TooltipTrigger>

                {!isOpen && (
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.title}
                    {item.badge && <Badge className={item.badgeColor}>{item.badge}</Badge>}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <div className={cn("flex gap-1", !isOpen && "flex-col items-center")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation("/dashboard/admin/notifications")}
                  className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-[9px] font-medium text-white flex items-center justify-center ring-2 ring-background">
                    {MOCK_NOTIFICATIONS}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isOpen && (
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-400">
              <Shield className="h-3 w-3" />
              v3.0.0
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
});

AdminSidebar.displayName = "AdminSidebar";

export default AdminSidebar;