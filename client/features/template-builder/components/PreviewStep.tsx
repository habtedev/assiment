"use client";
// features/template-builder/components/PreviewStep.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, BookOpen } from 'lucide-react';
import { PreviewQuestion } from './PreviewQuestion';
import type { TemplateFormState } from '../template.types';
import { LANGUAGES } from '../constants';

interface PreviewStepProps {
  state: TemplateFormState;
}

const CALENDAR_LABELS = {
  ethiopian: 'Ethiopian',
  gregorian: 'Gregorian',
};

export function PreviewStep({ state }: PreviewStepProps) {
  const currentLang = state.currentLang;
  const langInfo = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
            {typeof state.name[currentLang] === 'string' ? state.name[currentLang] : (typeof state.name.en === 'string' ? state.name.en : 'Untitled Template')}
          </span>
          <Badge variant="outline" className="rounded-full border-amber-200 bg-white/50 dark:bg-slate-900/50">
            <Eye className="h-3 w-3 mr-1 text-amber-500" />
            Preview ({langInfo.flag} {langInfo.name})
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Introduction */}
        {typeof state.intro[currentLang] === 'string' && state.intro[currentLang] && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200/50">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">📋 Introduction:</span> {state.intro[currentLang]}
            </p>
            {/* Show both languages */}
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">Amharic:</span> {state.intro.am || '—'}<br />
              <span className="font-semibold">English:</span> {state.intro.en || '—'}
            </div>
          </div>
        )}

        {/* Purpose */}
        {typeof state.why[currentLang] === 'string' && state.why[currentLang] && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200/50">
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">🎯 Purpose:</span> {state.why[currentLang]}
            </p>
            {/* Show both languages */}
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">Amharic:</span> {state.why.am || '—'}<br />
              <span className="font-semibold">English:</span> {state.why.en || '—'}
            </div>
          </div>
        )}

        {/* Calendar Info */}
        {state.academicYear && state.semester && (
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="outline" className="rounded-full border-amber-200">
              📅 {state.academicYear}
            </Badge>
            <Badge variant="outline" className="rounded-full border-amber-200">
              📚 {state.semester}
            </Badge>
            <Badge variant="outline" className="rounded-full border-amber-200">
              {CALENDAR_LABELS[state.calendarType]}
            </Badge>
          </div>
        )}

        <Separator className="bg-amber-200/50" />

        {/* Questions */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            Questions ({state.questions.length})
          </h3>

          {state.questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-amber-200/50 rounded-xl">
              <p className="text-sm text-muted-foreground italic">No questions in this template.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.questions.map((question, index) => (
                <PreviewQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  currentLang={currentLang}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}