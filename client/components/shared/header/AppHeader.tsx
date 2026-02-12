"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { Shield, Globe, Sparkles, ChevronDown, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import i18n, { languages } from '@/i18n';

export function AppHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  
  const isAuthPage = pathname?.includes('signin') || pathname?.includes('login');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = mounted
    ? languages.find(lang => lang.code === i18n.language) || languages[0]
    : languages[0];

  const changeLanguage = (langCode: typeof languages[number]['code']) => {
    i18n.changeLanguage(langCode);
    setIsLanguageOpen(false);
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      </header>
    );
  }

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
                alt={t('header.university')}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t('header.university')}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {t('header.subtitle')}
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
                {t('badge.secure')}
              </span>
            </Badge>
          )}
          
          {/* Premium Language Switcher - Direct i18n, No Hook */}
          <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isAuthPage ? "ghost" : "outline"}
                size="sm" 
                className={cn(
                  "gap-2 px-3",
                  "rounded-full",
                  !isAuthPage && [
                    "bg-gradient-to-r from-blue-50 to-indigo-50",
                    "dark:from-blue-950/30 dark:to-indigo-950/30",
                    "border-blue-200 dark:border-blue-800",
                    "hover:border-blue-300 dark:hover:border-blue-700",
                  ],
                  isAuthPage && [
                    "bg-slate-100/80 dark:bg-slate-800/80",
                    "hover:bg-slate-200/80 dark:hover:bg-slate-700/80",
                  ]
                )}
                aria-label={t('language.select')}
              >
                <Languages className={cn(
                  "h-4 w-4",
                  !isAuthPage ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                )} />
                <span className="text-sm font-medium hidden sm:inline">
                  {currentLanguage.flag}
                </span>
                <span className={cn(
                  "text-sm hidden md:inline",
                  !isAuthPage ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"
                )}>
                  {currentLanguage.name}
                </span>
                <ChevronDown className={cn(
                  "h-3 w-3",
                  "transition-transform duration-200",
                  isLanguageOpen && "rotate-180",
                  !isAuthPage ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                )} />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className={cn(
                "w-64 rounded-xl",
                "bg-white/95 dark:bg-slate-950/95",
                "backdrop-blur-xl",
                "border border-slate-200/50 dark:border-slate-800/50",
                "shadow-2xl"
              )}
            >
              <DropdownMenuLabel className="flex items-center gap-2 py-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t('language.select')}
                </span>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              
              <div className="p-1">
                {languages.map((lang) => {
                  const isActive = currentLanguage.code === lang.code;
                  
                  return (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-2 py-2.5",
                        "cursor-pointer select-none",
                        "transition-all duration-200",
                        "focus:bg-slate-100 dark:focus:bg-slate-800",
                        isActive && [
                          "bg-gradient-to-r from-blue-50 to-indigo-50",
                          "dark:from-blue-950/50 dark:to-indigo-950/50",
                          "border border-blue-200 dark:border-blue-800"
                        ]
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        "bg-slate-100 dark:bg-slate-800",
                        "border border-slate-200 dark:border-slate-700",
                        isActive && "border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/50"
                      )}>
                        <span className="text-lg">{lang.flag}</span>
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <span className={cn(
                          "text-sm font-medium",
                          isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-white"
                        )}>
                          {lang.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {lang.code.toUpperCase()}
                        </span>
                      </div>

                      {isActive && (
                        <div className="flex items-center">
                          <div className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full",
                            "bg-gradient-to-r from-blue-500 to-indigo-500",
                            "shadow-lg shadow-blue-500/25",
                            "animate-in zoom-in-50"
                          )}>
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
              
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              
              <div className="p-3">
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-2.5">
                  <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                    {t('footer.restriction')}
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}