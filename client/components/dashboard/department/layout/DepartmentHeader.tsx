"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronDown,
  GraduationCap,
  Search,
  BookMarked,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getJwtToken } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface DepartmentHeaderProps {
  departmentName?: string;
  departmentCode?: string;
  collegeName?: string;
  collegeCode?: string;
  showBackButton?: boolean;
  backUrl?: string;
  onBack?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  programCount?: number;
  teacherCount?: number;
  studentCount?: number;
}

export function DepartmentHeader({
  departmentName,
  departmentCode,
  collegeName,
  collegeCode,
  showBackButton = false,
  backUrl,
  onBack,
  userName,
  userEmail,
  userAvatar,
  notificationCount = 3,
  programCount = 5,
  teacherCount = 28,
  studentCount = 450,
}: DepartmentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useCurrentUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use real user data if available, otherwise fallback to props
  const displayUserName = currentUser?.name || userName || "User";
  const displayUserEmail = currentUser?.email || userEmail || "user@example.com";
  const displayUserAvatar = currentUser?.avatar || userAvatar;

  // Use college data from user or props
  const displayCollegeName = currentUser?.college?.name || collegeName || "College";
  const displayCollegeCode = currentUser?.college?.code || "COL";

  // For department data, we'll use props for now since department info might need separate fetching
  const displayDepartmentName = departmentName || "Department";
  const displayDepartmentCode = departmentCode || "DEPT";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const token = getJwtToken();
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";
      
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      toast({
        title: "👋 See you soon!",
        description: "You have been successfully logged out.",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };


  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };


  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard/department",
      icon: LayoutDashboard,
      description: "Main overview"
    },
    {
      label: "Programs",
      href: "/dashboard/department/programs",
      icon: BookMarked,
      badge: programCount,
      description: "Academic programs"
    },
    {
      label: "Courses",
      href: "/dashboard/department/courses",
      icon: BookOpen,
      badge: 24,
      description: "Course list"
    },
    {
      label: "Teachers",
      href: "/dashboard/department/teachers",
      icon: Users,
      badge: teacherCount,
      description: "Faculty members"
    },
    {
      label: "Students",
      href: "/dashboard/department/students",
      icon: GraduationCap,
      badge: studentCount,
      description: "Student list"
    },
    {
      label: "Reports",
      href: "/dashboard/department/reports",
      icon: BarChart3,
      description: "Analytics & reports"
    },
    {
      label: "Settings",
      href: "/dashboard/department/settings",
      icon: Settings,
      description: "Department settings"
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg"
          : "bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Left Section - Logo & Department Info */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 h-9 w-9"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                      {displayDepartmentCode}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{displayDepartmentName}</span>
                      <span className="text-xs text-muted-foreground">{typeof displayCollegeName === 'string' ? displayCollegeName : displayCollegeName?.en || displayCollegeName?.am || 'College'}</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Quick Stats */}
                <div className="p-4 border-b">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-base font-bold text-amber-600">{studentCount}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-amber-600">{teacherCount}</p>
                      <p className="text-xs text-muted-foreground">Teachers</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-amber-600">{programCount}</p>
                      <p className="text-xs text-muted-foreground">Programs</p>
                    </div>
                  </div>
                </div>

                <nav className="p-2 space-y-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 h-9"
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 text-amber-600" />
                      <span className="flex-1 text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge className="rounded-full bg-amber-100 text-amber-700 text-[10px] h-5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-9 text-rose-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Back Button */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Department Logo */}
            <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              {displayDepartmentCode?.charAt(0) || "D"}
            </div>

            {/* Department name - hidden on mobile */}
            <div className="hidden md:block">
              <h1 className="font-semibold text-sm whitespace-nowrap">
                {displayDepartmentName}
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{typeof displayCollegeName === 'string' ? displayCollegeName : displayCollegeName?.en || displayCollegeName?.am || 'College'}</span>
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, teachers..."
                className="pl-9 pr-4 h-9 text-sm rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 h-9 w-9"
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[8px] font-medium text-white flex items-center justify-center ring-2 ring-background">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between text-sm">
                  <span>Notifications</span>
                  <Badge variant="outline" className="rounded-full text-[10px] h-5">
                    {notificationCount} new
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-xs">
                          {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">
                            {i === 1
                              ? "New evaluation"
                              : i === 2
                                ? "New student"
                                : "Report ready"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {i === 1 ? "2m" : i === 2 ? "1h" : "3h"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs h-8">
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 pl-1 pr-2 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 hidden sm:flex items-center gap-1"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white text-[10px]">
                      {displayUserName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{displayUserName}</span>
                    <span className="text-[10px] text-muted-foreground">{displayUserEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs h-8">
                  <User className="h-3.5 w-3.5" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs h-8">
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-xs h-8 text-rose-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-full h-9 w-9"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white text-[10px]">
                  {displayUserName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 pr-4 h-9 text-sm rounded-full bg-muted/50 border-0"
            />
          </div>
        </div>
      </div>
    </header>
  );
}