import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md border bg-white flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
              alt="University of Gondar Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                University of Gondar
              </h1>
              <Badge variant="secondary" className="rounded-xl text-xs">
                Academic System
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Teacher Assessment & Performance Analytics Platform
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>Semester Evaluation Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
}
