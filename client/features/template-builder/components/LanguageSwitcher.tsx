// features/template-builder/components/LanguageSwitcher.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Language } from '../template.types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

import { LANGUAGES } from '../constants';

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-b bg-gradient-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-amber-700 dark:text-amber-300 hidden sm:inline">
          ቋንቋ / Language:
        </span>
      </div>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLang === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              'rounded-full px-3 sm:px-4 h-8 text-xs sm:text-sm transition-all',
              currentLang === lang.code && 
              'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 shadow-md hover:shadow-lg'
            )}
          >
            <span className="mr-1.5 text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}