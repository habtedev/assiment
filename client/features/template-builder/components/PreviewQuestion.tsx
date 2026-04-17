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
      className="border rounded-xl p-3 hover:shadow-md transition-all bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xs flex items-center justify-center font-medium shadow-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="outline" className="rounded-full text-xs border-indigo-200 text-indigo-600">
              {typeConfig.icon} {typeConfig.label}
            </Badge>
            {question.required && (
              <Badge className="rounded-full bg-indigo-100 text-indigo-700 text-xs">
                Required
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <p className="font-medium text-sm break-words text-gray-900 dark:text-gray-100">
            {question.translations[currentLang]?.text ||
             question.translations.en?.text ||
             'No text available'}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 italic border-l-2 border-indigo-300 pl-3">
                    {question.translations[currentLang]?.description}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices for multiple choice */}
          {question.type === 'multiple' && question.choices && question.choices.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {question.choices.map((choice, i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="h-3 w-3 rounded-full border-2 border-indigo-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {choice.translations[currentLang] || choice.translations.en}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Paragraph preview */}
          {question.type === 'paragraph' && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
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
              className="mt-1.5 h-6 text-xs hover:bg-indigo-100/50 text-gray-500 cursor-pointer"
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