"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PreviewQuestion } from './PreviewQuestion';
import type { TemplateFormState } from '../template.types';

interface PreviewStepProps {
  state: TemplateFormState;
}

export function PreviewStep({ state }: PreviewStepProps) {
  const { currentLang, name, intro, why, academicYear, semester, calendarType, questions } = state;

  // Helper to get localized string safely
  const getLabel = (field: any) => {
    if (typeof field === 'string') return field || '—';
    if (field && typeof field === 'object') return field.en || field.am || '—';
    return '—';
  };

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold">
          {getLabel(name)}
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span>{academicYear || 'Year TBD'}</span>
          <span>{semester || 'Semester TBD'}</span>
          <span>{calendarType === 'gregorian' ? 'Gregorian' : 'Ethiopian'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {getLabel(intro) !== '—' && (
          <div>
            <h3 className="font-semibold mb-2">Introduction</h3>
            <p className="text-gray-700">{getLabel(intro)}</p>
          </div>
        )}

        {getLabel(why) !== '—' && (
          <div>
            <h3 className="font-semibold mb-2">Objective</h3>
            <p className="text-gray-700">{getLabel(why)}</p>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Questions ({questions.length})</h3>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions added yet</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
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