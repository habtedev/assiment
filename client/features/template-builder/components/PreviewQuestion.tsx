// features/template-builder/components/PreviewQuestion.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Question, Language } from '../template.types';

interface PreviewQuestionProps {
  question: Question;
  index: number;
  currentLang: Language;
}

export function PreviewQuestion({ question, index, currentLang }: PreviewQuestionProps) {
  const [expanded, setExpanded] = useState(false);

  const typeConfig = {
    multiple: { icon: '🔘', label: 'Multiple Choice' },
    paragraph: { icon: '📝', label: 'Paragraph' },
  }[question.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border rounded-xl p-4 hover:shadow-md transition-all bg-white/50 dark:bg-slate-900/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white text-xs flex items-center justify-center font-medium shadow-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="rounded-full text-xs">
              {typeConfig.icon} {typeConfig.label}
            </Badge>
            {question.required && (
              <Badge className="rounded-full bg-amber-100 text-amber-700 text-xs">
                Required
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <p className="font-medium text-sm sm:text-base break-words">
            {question.translations[currentLang]?.text || 
             question.translations.en?.text || 
             'No text available'}
            {/* Show both languages */}
            {question.translations.am && (
              <span className="block text-xs text-muted-foreground mt-1">
                <span className="font-semibold">Amharic:</span> {question.translations.am.text || '—'}
              </span>
            )}
            {question.translations.en && (
              <span className="block text-xs text-muted-foreground mt-1">
                <span className="font-semibold">English:</span> {question.translations.en.text || '—'}
              </span>
            )}
          </p>

          {/* Expandable Description */}
          <AnimatePresence>
            {(expanded || question.translations[currentLang]?.description) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {question.translations[currentLang]?.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 italic border-l-2 border-amber-300 pl-3">
                    {question.translations[currentLang]?.description}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices for multiple choice */}
          {question.type === 'multiple' && question.choices && question.choices.length > 0 && (
            <div className="mt-3 space-y-2">
              {question.choices.map((choice, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-4 w-4 rounded-full border-2 border-amber-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {choice.translations[currentLang] || choice.translations.en}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Paragraph preview */}
          {question.type === 'paragraph' && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-xs text-muted-foreground italic">
                Students will enter their paragraph answer here...
              </p>
            </div>
          )}

          {/* Show more/less button */}
          {question.translations[currentLang]?.description && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 h-7 text-xs hover:bg-amber-100/50"
            >
              {expanded ? (
                <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>Show more <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}