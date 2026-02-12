"use client";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =============================
   PROFESSIONAL HEADER
============================= */

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl overflow-hidden shadow border bg-background flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-semibold tracking-tight">
                University of Gondar
              </h1>
              <Badge
                variant="secondary"
                className="rounded-xl text-[10px] px-2 py-0.5"
              >
                HR & Academic System
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground hidden md:block">
              Teacher Assessment & Performance Analytics Platform
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>Semester Evaluation Portal</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Theme Toggle */}
          <ThemeToggle />

          <Button
            size="sm"
            className="rounded-xl shadow-sm"
            onClick={() => console.log("Add action triggered")}
          >
            Add to System
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header