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

const typeConfig: Record<string, { icon: string; label: string }> = {
  multiple: { icon: '🔘', label: 'Multiple Choice' },
  paragraph: { icon: '📝', label: 'Paragraph' },
};

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
  const currentType = typeConfig[question.type] || { icon: '❓', label: 'Unknown' };
  const questionText = question.translations[currentLang]?.text || 
                      question.translations.en?.text || 
                      'Untitled question';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex gap-4">
        {/* Question Number */}
        <div className="shrink-0 h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Type & Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-medium px-3 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {currentType.icon} {currentType.label}
            </Badge>

            {question.required ? (
              <Badge className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs px-3 py-0.5">
                Required
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full text-xs px-3 py-0.5 border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                Optional
              </Badge>
            )}

            <Badge variant="outline" className="rounded-full text-xs px-3 py-0.5 border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400">
              Weight: {question.weight}
            </Badge>
          </div>

          {/* Question Text */}
          <p className="text-base font-medium leading-snug text-gray-900 dark:text-gray-100 break-words">
            {questionText}
          </p>

          {/* Description */}
          {question.translations[currentLang]?.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 border-l-3 border-indigo-400 pl-3 italic">
              {question.translations[currentLang].description}
            </p>
          )}

          {/* Choices */}
          {question.choices && question.choices.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {question.choices.map((choice, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="rounded-full text-xs py-0.5 px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {choice.translations[currentLang] || choice.translations.en}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons - Always visible on mobile, hover on desktop */}
        <div className="flex flex-col items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  className="h-8 w-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  className="h-8 w-8 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950 text-indigo-600"
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
                  className="h-8 w-8 rounded-xl hover:bg-red-100 dark:hover:bg-red-950 text-red-600"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Delete Question</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}