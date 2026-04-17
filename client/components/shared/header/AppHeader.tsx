"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/dashboard/admin/layouts/LanguageSwitcher';

export function AppHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('signin') || pathname?.includes('login');

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/80 dark:ring-slate-800/80">
              <img
                src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
                alt="University of Gondar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              University of Gondar
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Teacher Assessment System
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {!isAuthPage && (
            <Badge
              variant="outline"
              className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50"
            >
              <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Secure Portal
              </span>
            </Badge>
          )}

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}