"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
  Settings,
  BarChart3,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const MobileNav: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Templates", href: "/dashboard/admin/templates", icon: FileText },
    { title: "Questions", href: "/dashboard/admin/questions", icon: HelpCircle },
    { title: "Colleges", href: "/dashboard/admin/colleges", icon: Building2 },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-40 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-200/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold">
                  UoG
                </div>
                <div>
                  <span className="font-bold text-sm">Teacher Assessment</span>
                  <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@uog.edu.et</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  pathname === item.href
                    ? "bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 text-amber-700 dark:text-amber-300 font-medium"
                    : "hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};