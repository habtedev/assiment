// features/template-builder/components/QuestionCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Question, Language } from '../template.types';

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  currentLang: Language;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const LANGUAGES = [
  { code: 'en' as Language, label: 'EN', color: 'blue' },
  { code: 'am' as Language, label: 'አማ', color: 'amber' },
];

export function QuestionCard({
  question,
  index,
  totalQuestions,
  currentLang,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: QuestionCardProps) {
  const typeConfig = {
    multiple: { icon: '🔘', label: 'Multiple Choice' },
    paragraph: { icon: '📝', label: 'Paragraph' },
  }[question.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
            <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs px-2 h-5">
              <span className="mr-1">{typeConfig.icon}</span>
              {typeConfig.label}
            </Badge>
            {question.required ? (
              <Badge className="rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-xs px-2 h-5">
                Required
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full text-[10px] sm:text-xs px-2 h-5">
                Optional
              </Badge>
            )}
            <Badge variant="outline" className="rounded-full text-[10px] sm:text-xs px-2 h-5">
              Weight: {question.weight}
            </Badge>
          </div>

          {/* Question Text */}
          <p className="font-medium text-sm sm:text-base break-words">
            {question.translations[currentLang]?.text || 
             question.translations.en?.text || 
             'No text available'}
          </p>

          {/* Description */}
          {question.translations[currentLang]?.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 italic border-l-2 border-amber-300 pl-2">
              {question.translations[currentLang]?.description}
            </p>
          )}

          {/* Choices for multiple choice */}
          {question.choices && question.choices.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
              {question.choices.map((choice, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="rounded-full text-xs bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/50 dark:to-rose-900/50"
                >
                  {choice.translations[currentLang] || choice.translations.en}
                </Badge>
              ))}
            </div>
          )}

          {/* Language Indicators */}
          <div className="flex items-center gap-1 sm:gap-2 mt-3">
            {LANGUAGES.map((lang) => (
              <Badge
                key={lang.code}
                variant="outline"
                className={cn(
                  'rounded-full text-[8px] sm:text-[10px] px-1.5 h-5 transition-colors',
                  question.translations[lang.code]?.text
                    ? `bg-${lang.color}-50 text-${lang.color}-700 border-${lang.color}-200 dark:bg-${lang.color}-950/50`
                    : 'opacity-40'
                )}
              >
                {lang.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col items-center gap-1 mt-2 sm:mt-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                  onClick={onMoveUp}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Move Up</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                  onClick={onMoveDown}
                  disabled={index === totalQuestions - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Move Down</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                  onClick={onDuplicate}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Duplicate</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-rose-100/50 dark:hover:bg-rose-900/30 text-rose-600"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}