"use client";

import React, { useCallback, useMemo, memo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Building2,
  ClipboardList,
  Bell,
  LogOut,
  User,
  Moon,
  Sun,
  Sparkles,
  Heart,
  Shield,
  GraduationCap,
  Award,
  Clock,
  Zap,
  Menu,
  X,
  Home,
  Search,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";

import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

import { useTheme } from "next-themes";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import SidebarTemplatesCollapse from "@/components/dashboard/admin/layouts/SidebarTemplatesCollapse";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
  onTemplateSelect?: (template: any) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
  description?: string;
  isTemplatesButton?: boolean;
}

// Mock data
const MOCK_NOTIFICATIONS = 3;
const MOCK_TEMPLATES_COUNT = 12;
const MOCK_COLLEGES_COUNT = 8;

export const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onToggle,
  isMobile = false,
  onMobileClose,
  onTemplateSelect,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { t } = useTranslation();
  const navItems: NavItem[] = useMemo(() => [
    {
      title: t('dashboard.title', 'Dashboard'),
      href: "/dashboard/student",
      icon: LayoutDashboard,
      description: t('dashboard.overview', 'Overview & metrics'),
    },
    {
      title: t('sidebar.templates', 'Templates'),
      href: "#", // Use placeholder href since we handle click manually
      icon: FileText,
      description: t('sidebar.templatesDesc', 'View all templates'),
      isTemplatesButton: true, // Special flag for templates button
    },
    {
      title: t('dashboard.settings', 'Settings'),
      href: "/dashboard/",
      icon: Settings,
      description: t('sidebar.settingsDesc', 'System configuration'),
    },
  ], [t]);

  const isActiveRoute = useCallback((href: string) => {
    if (href === "/dashboard/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    toast({
      title: "See you soon! 👋",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => router.push("/"), 1000);
  }, [toast, router]);

  const handleNavigation = useCallback((item: NavItem) => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
    
    // Special handling for Templates button - show all templates in main area
    if (item.isTemplatesButton) {
      onTemplateSelect?.({ showAllTemplates: true });
      return;
    }
    
    router.push(item.href);
  }, [isMobile, onMobileClose, router, onTemplateSelect]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: `${theme === "dark" ? "☀️ Light" : "🌙 Dark"} mode activated`,
      duration: 2000,
    });
  }, [theme, setTheme, toast]);

  if (!mounted) return null;

  return (
    <motion.aside
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "h-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-amber-200/50 dark:border-amber-800/50 flex flex-col relative",
        "shadow-2xl shadow-amber-500/5 dark:shadow-amber-500/10"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Decorative gradient line - Like Login Page */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-500 via-rose-500 to-purple-500" />

      {/* Toggle Button */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute -right-3 top-20 z-50"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}

      {/* Logo Area - Like Login Page */}
      <div className={cn(
        "p-5 border-b border-amber-200/50 dark:border-amber-800/50",
        isOpen ? "px-5" : "px-0 text-center"
      )}>
        <div className={cn(
          "flex items-center",
          isOpen ? "gap-3" : "flex-col gap-2"
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-rose-600 rounded-xl blur-lg opacity-40 animate-pulse" />
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University Logo"
              className="relative h-10 w-10 rounded-xl object-cover shadow-lg"
            />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                {t('header.university', 'University of Gondar')}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                {t('badge.assessment', 'Teacher Assessment System')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User Profile - Like Login Page Avatar Style */}
      <div className={cn(
        "p-4 border-b border-amber-200/50 dark:border-amber-800/50",
        !isOpen && "text-center"
      )}>
        <div className={cn(
          "flex items-center",
          isOpen ? "gap-3" : "flex-col gap-2"
        )}>
          <div className="relative">
            <Avatar className={cn(
              "ring-2 ring-amber-500/30",
              isOpen ? "h-12 w-12" : "h-10 w-10"
            )}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-linear-to-br from-amber-400 to-rose-500 text-white">
                AK
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dr. Abebe Kebede</p>
              <p className="text-xs text-muted-foreground truncate">{t('roles.admin', 'Administrator')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      !isOpen && "justify-center",
                      isActive
                        ? "bg-linear-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 text-amber-700 dark:text-amber-300 font-medium shadow-sm"
                        : "hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="relative">
                      <Icon className={cn(
                        "h-4 w-4 transition-all",
                        isActive && "text-amber-600 dark:text-amber-400"
                      )} />
                      {isActive && (
                        <motion.div
                          layoutId="activeNavGlow"
                          className="absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10"
                          transition={{ type: "spring", bounce: 0.2 }}
                        />
                      )}
                    </div>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-sm text-left">{item.title}</span>
                        {item.badge && (
                          <Badge className={cn(
                            "rounded-full text-[10px] h-5 px-1.5",
                            item.badgeColor
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {!isOpen && isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-500"
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge className={cn("rounded-full", item.badgeColor)}>
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>

              </nav>

      {/* Footer - Like Login Page Style */}
      <div className="p-4 border-t border-amber-200/50 dark:border-amber-800/50 space-y-3">
        {/* Quick Stats */}
        {isOpen && (
          <div className="space-y-2 px-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {t('sidebar.activeTemplates', 'Active Templates')}
              </span>
              <span className="font-medium text-amber-600">8</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          "flex gap-1",
          !isOpen && "flex-col items-center"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className={cn(
                    "rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/30",
                    !isOpen ? "h-9 w-9" : "h-8 w-8"
                  )}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>
                {theme === "dark" ? t('sidebar.lightMode', 'Light Mode') : t('sidebar.darkMode', 'Dark Mode')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isMobile && onMobileClose) {
                      onMobileClose();
                    }
                    router.push("/dashboard/admin/notifications");
                  }}
                  className={cn(
                    "rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/30 relative",
                    !isOpen ? "h-9 w-9" : "h-8 w-8"
                  )}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-[9px] font-medium text-white flex items-center justify-center ring-2 ring-background">
                    {MOCK_NOTIFICATIONS}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>
                {t('sidebar.notifications', 'Notifications')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className={cn(
                    "rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-rose-600",
                    !isOpen ? "h-9 w-9" : "h-8 w-8"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isOpen ? "top" : "right"}>
                {t('dashboard.logout', 'Logout')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Version Info - Like Login Page Footer */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pt-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30">
              <Shield className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300">
                v3.0.0 • 2026
              </span>
            </div>
            <p className="text-[8px] text-muted-foreground mt-2">
              {t('footer.dedicated', 'Dedicated to excellence since 1954')}
            </p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

AdminSidebar.displayName = "AdminSidebar";

export default AdminSidebar;