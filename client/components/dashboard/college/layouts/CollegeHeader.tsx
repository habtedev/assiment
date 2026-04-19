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
  Search,
  GraduationCap,
  Calendar,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getJwtToken } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCollege } from "@/hooks/useCollege";

interface CollegeHeaderProps {
  collegeName?: string;
  collegeCode?: string;
  collegeLogo?: string;
  showBackButton?: boolean;
  backUrl?: string;
  onBack?: () => void;
  notificationCount?: number;
}

export function CollegeHeader({
  collegeName,
  collegeCode,
  collegeLogo,
  showBackButton = false,
  backUrl,
  onBack,
  notificationCount = 3,
}: CollegeHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const { user: currentUser } = useCurrentUser();
  const { college: fetchedCollege } = useCollege(currentUser?.collegeId);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prioritize data from hooks, then props
  const user = currentUser;
  const college = currentUser?.college || fetchedCollege;

  const displayCollegeName =
    typeof college?.name === "string"
      ? college.name
      : college?.name?.en || college?.name?.am || collegeName || "College";

  const displayCollegeCode = college?.code || collegeCode || "COL";
  const displayUserName = user?.name || "User";
  const displayUserEmail = user?.email || "user@example.com";
  const displayUserAvatar = user?.avatar;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast({
        title: "👋 Logged out successfully",
        description: "See you next time!",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else if (backUrl) router.push(backUrl);
    else router.back();
  };

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard/college", icon: LayoutDashboard },
    { label: "Students", href: "/dashboard/college/students", icon: Users },
    { label: "Teachers", href: "/dashboard/college/teachers", icon: GraduationCap },
    { label: "Courses", href: "/dashboard/college/courses", icon: BookOpen },
    { label: "Reports", href: "/dashboard/college/reports", icon: Calendar },
    { label: "Settings", href: "/dashboard/college/settings", icon: Settings },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-lg border-gray-200 dark:border-gray-800"
          : "bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo + College Info + Back Button */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-md">
                      {displayCollegeCode}
                    </div>
                    <div>
                      <p className="font-semibold">{displayCollegeName}</p>
                      <p className="text-xs text-muted-foreground">{displayCollegeCode}</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="p-4 space-y-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 rounded-xl"
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                  <Separator className="my-4" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 text-rose-600 hover:text-rose-700 rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
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
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* College Branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-md ring-1 ring-white/30">
                {collegeLogo ? (
                  <img
                    src={collegeLogo}
                    alt={displayCollegeName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayCollegeCode.charAt(0)
                )}
              </div>

              <div className="hidden sm:block">
                <h1 className="font-semibold text-base tracking-tight text-foreground">
                  {displayCollegeName}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{displayCollegeCode}</span>
                </div>
              </div>
            </div>

            {/* Mobile Page Title */}
            <div className="sm:hidden ml-2">
              <h2 className="font-medium text-sm text-foreground truncate">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right Side: Search + Notifications + User Menu + Theme */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden lg:block w-80">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students, courses..."
                  className="pl-10 bg-muted/70 border-0 focus-visible:ring-1 focus-visible:ring-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-gradient-to-r from-amber-500 to-rose-500 border-2 border-background"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  Notifications
                  <Badge variant="secondary" className="text-xs">
                    {notificationCount} new
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* You can make this dynamic later */}
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="p-4 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-lg flex-shrink-0">
                          {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {i === 1 ? "New evaluation submitted" : i === 2 ? "New student registered" : "Report is ready"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 1 ? "Just now" : i === 2 ? "1 hour ago" : "3 hours ago"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-muted-foreground py-3">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="pl-1 pr-3 h-10 rounded-full hover:bg-accent gap-2.5"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-amber-500/20">
                    <AvatarImage src={displayUserAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-rose-600 text-white text-xs font-medium">
                      {displayUserName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none">{displayUserName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{displayUserEmail}</p>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{displayUserName}</span>
                  <span className="text-xs text-muted-foreground font-normal">{displayUserEmail}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Avatar */}
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-rose-600 text-white">
                  {displayUserName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/70 border-0 focus-visible:ring-1 focus-visible:ring-amber-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}