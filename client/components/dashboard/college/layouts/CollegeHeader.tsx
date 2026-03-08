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
  Heart,
  Shield,
  GraduationCap,
  Calendar,
  Clock,
  Search,
  Globe,
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { getJwtToken } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/header/ThemeToggle";

// Types
type Language = "en" | "am";

interface CollegeHeaderProps {
  collegeName?: string;
  collegeCode?: string;
  collegeLogo?: string;
  showBackButton?: boolean;
  backUrl?: string;
  onBack?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const LANGUAGES = [
  { code: "en" as Language, label: "English", shortLabel: "EN", flag: "🇬🇧" },
  { code: "am" as Language, label: "አማርኛ", shortLabel: "አማ", flag: "🇪🇹" },
];

export function CollegeHeader({
  collegeName = "College of Informatics",
  collegeCode = "CIS",
  collegeLogo,
  showBackButton = false,
  backUrl,
  onBack,
  userName = "Dr. Abebe Kebede",
  userEmail = "abebe.kebede@uog.edu.et",
  userAvatar,
  notificationCount = 3,
}: CollegeHeaderProps) {
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
  }, []);

  useEffect(() => {
    setCurrentLang(i18n.language as Language);
  }, [i18n.language]);

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

  const navigationItems = [
    { label: currentLang === "am" ? "ዳሽቦርድ" : "Dashboard", href: "/dashboard/college", icon: LayoutDashboard },
    { label: currentLang === "am" ? "ተማሪዎች" : "Students", href: "/dashboard/college/students", icon: Users },
    { label: currentLang === "am" ? "መምህራን" : "Teachers", href: "/dashboard/college/teachers", icon: GraduationCap },
    { label: currentLang === "am" ? "ኮርሶች" : "Courses", href: "/dashboard/college/courses", icon: BookOpen },
    { label: currentLang === "am" ? "ሪፖርቶች" : "Reports", href: "/dashboard/college/reports", icon: Calendar },
    { label: currentLang === "am" ? "ማስተካከያ" : "Settings", href: "/dashboard/college/settings", icon: Settings },
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
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Section - Logo & College Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold">
                      {collegeCode}
                    </div>
                    <span className="text-sm font-semibold">{collegeName}</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-4 space-y-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start gap-3 rounded-lg"
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                  <Separator className="my-4" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg text-rose-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {currentLang === "am" ? "ውጣ" : "Logout"}
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
                className="rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* College Logo & Name */}
            <div className="relative flex items-center gap-2 group">
              <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-linear-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {collegeLogo ? (
                  <img src={collegeLogo} alt={collegeName} className="h-full w-full object-cover" />
                ) : (
                  collegeCode?.charAt(0) || "C"
                )}
              </div>
              
              {/* College name and code - visible on desktop only */}
              {/* College name and code - visible on desktop only (removed from mobile) */}
              <div className="hidden sm:block">
                <h1 className="font-semibold text-sm bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                  {collegeName}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {collegeCode}
                </p>
              </div>
            </div>

            {/* Page Title - Mobile */}
            <div className="sm:hidden">
              <h2 className="font-medium text-sm truncate max-w-37.5">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-md">
            <div className={cn(
              "relative transition-all duration-300",
              searchFocused && "scale-105"
            )}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={currentLang === "am" ? "ፈልግ..." : "Search..."}
                className="pl-9 pr-4 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            <Select
              value={currentLang}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-28 rounded-full border-amber-200 bg-muted/50 focus:ring-amber-500">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="flex items-center gap-2">
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-[9px] font-medium text-white flex items-center justify-center ring-2 ring-background"
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>{currentLang === "am" ? "ማሳወቂያዎች" : "Notifications"}</span>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {notificationCount} {currentLang === "am" ? "አዲስ" : "new"}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer hover:bg-amber-50/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                          {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {i === 1 
                              ? (currentLang === "am" ? "አዲስ ግምገማ" : "New evaluation")
                              : i === 2
                                ? (currentLang === "am" ? "አዲስ ተማሪ" : "New student")
                                : (currentLang === "am" ? "ሪፖርት ዝግጁ" : "Report ready")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 1 ? "2 min ago" : i === 2 ? "1 hour ago" : "3 hours ago"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-muted-foreground">
                  {currentLang === "am" ? "ሁሉንም ይመልከቱ" : "View all"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 pl-1 pr-3 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 hidden sm:flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-amber-500/30">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className="bg-linear-to-br from-amber-400 to-rose-500 text-white text-xs">
                      {userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <User className="h-4 w-4" />
                  {currentLang === "am" ? "መገለጫ" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" />
                  {currentLang === "am" ? "ማስተካከያ" : "Settings"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-rose-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {currentLang === "am" ? "ውጣ" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-full hover:bg-amber-100/50"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-linear-to-br from-amber-400 to-rose-500 text-white text-xs">
                  {userName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={currentLang === "am" ? "ፈልግ..." : "Search..."}
              className="pl-9 pr-4 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="h-0.5 bg-linear-to-r from-amber-500 to-rose-500"
        initial={{ width: "0%" }}
        animate={{ width: "65%" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.header>
  );
}