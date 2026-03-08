"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  Sparkles,
  GraduationCap,
  Search,
  Globe,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { getJwtToken } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";

// Types
type Language = "en" | "am";

interface DepartmentHeaderProps {
  departmentName?: string;
  departmentCode?: string;
  collegeName?: string;
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

// Translation keys for all text
const translations = {
  en: {
    search: "Search courses, teachers...",
    mobileSearch: "Search...",
    notifications: "Notifications",
    new: "new",
    viewAll: "View all",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    quickStats: "Quick Stats",
    students: "Students",
    teachers: "Teachers",
    programs: "Programs",
    dashboard: "Dashboard",
    courses: "Courses",
    reports: "Reports",
    mainOverview: "Main overview",
    academicPrograms: "Academic programs",
    courseList: "Course list",
    facultyMembers: "Faculty members",
    studentList: "Student list",
    analytics: "Analytics & reports",
    departmentSettings: "Department settings",
    selectLanguage: "Select Language",
  },
  am: {
    search: "ኮርሶችን እና መምህራንን ይፈልጉ...",
    mobileSearch: "ፈልግ...",
    notifications: "ማሳወቂያዎች",
    new: "አዲስ",
    viewAll: "ሁሉንም ይመልከቱ",
    profile: "መገለጫ",
    settings: "ማስተካከያ",
    logout: "ውጣ",
    quickStats: "ፈጣን መረጃ",
    students: "ተማሪዎች",
    teachers: "መምህራን",
    programs: "ፕሮግራሞች",
    dashboard: "ዳሽቦርድ",
    courses: "ኮርሶች",
    reports: "ሪፖርቶች",
    mainOverview: "ዋና ገጽ",
    academicPrograms: "የትምህርት ፕሮግራሞች",
    courseList: "ኮርሶች ዝርዝር",
    facultyMembers: "መምህራን",
    studentList: "ተማሪዎች ዝርዝር",
    analytics: "ሪፖርቶች",
    departmentSettings: "የመምሪያ ማስተካከያ",
    selectLanguage: "ቋንቋ ምረጥ",
  },
};

export function DepartmentHeader({
  departmentName = "Department of Computer Science",
  departmentCode = "CS",
  collegeName = "College of Informatics",
  showBackButton = false,
  backUrl,
  onBack,
  userName = "Dr. Tadesse Hailu",
  userEmail = "tadesse.hailu@uog.edu.et",
  userAvatar,
  notificationCount = 3,
  programCount = 5,
  teacherCount = 28,
  studentCount = 450,
}: DepartmentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentLang(i18n.language as Language);
  }, []);

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
        title: currentLang === "am" ? "👋 ደህና ሁን" : "👋 See you soon!",
        description: currentLang === "am" 
          ? "በተሳካ ሁኔታ ወጥተዋል" 
          : "You have been successfully logged out.",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: currentLang === "am" ? "❌ ስህተት" : "❌ Error",
        description: currentLang === "am"
          ? "መውጣት አልተሳካም"
          : "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    toast({
      title: lang === "am" ? "🌙 አማርኛ ተመረጠ" : "☀️ English Selected",
      duration: 2000,
    });
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

  const lang = currentLang;
  const txt = translations[lang];

  const navigationItems = [
    { 
      label: txt.dashboard, 
      href: "/dashboard/department", 
      icon: LayoutDashboard,
      description: txt.mainOverview
    },
    { 
      label: txt.programs, 
      href: "/dashboard/department/programs", 
      icon: BookMarked,
      badge: programCount,
      description: txt.academicPrograms
    },
    { 
      label: txt.courses, 
      href: "/dashboard/department/courses", 
      icon: BookOpen,
      badge: 24,
      description: txt.courseList
    },
    { 
      label: txt.teachers, 
      href: "/dashboard/department/teachers", 
      icon: Users,
      badge: teacherCount,
      description: txt.facultyMembers
    },
    { 
      label: txt.students, 
      href: "/dashboard/department/students", 
      icon: GraduationCap,
      badge: studentCount,
      description: txt.studentList
    },
    { 
      label: txt.reports, 
      href: "/dashboard/department/reports", 
      icon: BarChart3,
      description: txt.analytics
    },
    { 
      label: txt.settings, 
      href: "/dashboard/department/settings", 
      icon: Settings,
      description: txt.departmentSettings
    },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-amber-200/50 animate-pulse" />
    );
  }

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-800/50 shadow-lg"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-amber-200/30 dark:border-amber-800/30"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
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
                      {departmentCode}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{departmentName}</span>
                      <span className="text-xs text-muted-foreground">{collegeName}</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Quick Stats */}
                <div className="p-4 border-b">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-base font-bold text-amber-600">{studentCount}</p>
                      <p className="text-xs text-muted-foreground">{txt.students}</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-amber-600">{teacherCount}</p>
                      <p className="text-xs text-muted-foreground">{txt.teachers}</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-amber-600">{programCount}</p>
                      <p className="text-xs text-muted-foreground">{txt.programs}</p>
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
                    <span className="text-sm">{txt.logout}</span>
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
              {departmentCode?.charAt(0) || "D"}
            </div>
            
            {/* Department name - hidden on mobile */}
            <div className="hidden md:block">
              <h1 className="font-semibold text-sm whitespace-nowrap">
                {departmentName}
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{collegeName}</span>
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={txt.search}
                className="pl-9 pr-4 h-9 text-sm rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            
            {/* Language Select - shadcn Select */}
            <Select value={currentLang} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[90px] h-9 rounded-full border-amber-200 bg-muted/50">
                <SelectValue>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs">{currentLang === "am" ? "አማ" : "EN"}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" className="text-sm">
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span> English
                  </span>
                </SelectItem>
                <SelectItem value="am" className="text-sm">
                  <span className="flex items-center gap-2">
                    <span>🇪🇹</span> አማርኛ
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

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
                  <span>{txt.notifications}</span>
                  <Badge variant="outline" className="rounded-full text-[10px] h-5">
                    {notificationCount} {txt.new}
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
                              ? (lang === "am" ? "አዲስ ግምገማ" : "New evaluation")
                              : i === 2
                                ? (lang === "am" ? "አዲስ ተማሪ" : "New student")
                                : (lang === "am" ? "ሪፖርት ዝግጁ" : "Report ready")}
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
                  {txt.viewAll}
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
                      {userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{userName}</span>
                    <span className="text-[10px] text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs h-8">
                  <User className="h-3.5 w-3.5" />
                  {txt.profile}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs h-8">
                  <Settings className="h-3.5 w-3.5" />
                  {txt.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-xs h-8 text-rose-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {txt.logout}
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
                  {userName.split(" ").map(n => n[0]).join("")}
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
              placeholder={txt.mobileSearch}
              className="pl-9 pr-4 h-9 text-sm rounded-full bg-muted/50 border-0"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}