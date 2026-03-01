// features/template-builder/components/DetailsStep.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { TemplateFormState, TemplateFormAction, CalendarType, Language } from '../template.types';
import { cn } from '@/lib/utils';
import { LANGUAGES, CALENDAR_TYPES } from '../constants';
import { SEMESTERS } from '../constants/semesters';
import { ACADEMIC_YEARS } from '../constants/academicYears';

interface DetailsStepProps {
  state: TemplateFormState;
  dispatch: React.Dispatch<TemplateFormAction>;
}

export function DetailsStep({ state, dispatch }: DetailsStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {/* Template Name */}
        <div>
          <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
            Template Name
            <span className="text-rose-500">*</span>
            {!Object.values(state.name).some(v => v) && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 text-[10px]">
                Required
              </Badge>
            )}
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg">
                  {lang.flag}
                </div>
                <Input
                  value={state.name[lang.code]}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_NAME',
                      payload: { lang: lang.code, value: e.target.value },
                    })
                  }
                  placeholder={`Template Name (${lang.label})`}
                  className={cn(
                    'pl-10 sm:pl-12 text-sm transition-all',
                    state.name[lang.code]
                      ? 'border-green-500/50 focus-visible:ring-green-500'
                      : 'border-amber-200/50 focus-visible:ring-amber-500'
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Type */}
        <div>
          <Label className="text-sm sm:text-base font-semibold">Calendar Type</Label>
          <Select
            value={state.calendarType}
            onValueChange={(val) =>
              dispatch({ type: 'SET_CALENDAR_TYPE', payload: val as CalendarType })
            }
          >
            <SelectTrigger className="mt-1.5 border-amber-200/50 focus-visible:ring-amber-500">
              <SelectValue placeholder="Select calendar type" />
            </SelectTrigger>
            <SelectContent>
              {CALENDAR_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Academic Year */}
        <div>
          <Label className="text-sm sm:text-base font-semibold">Academic Year</Label>
          <Select
            value={state.academicYear}
            onValueChange={(val) => dispatch({ type: 'SET_ACADEMIC_YEAR', payload: val })}
          >
            <SelectTrigger className="mt-1.5 border-amber-200/50 focus-visible:ring-amber-500">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS[state.calendarType].map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester */}
        <div>
          <Label className="text-sm sm:text-base font-semibold">Semester</Label>
          <Select
            value={state.semester}
            onValueChange={(val) => dispatch({ type: 'SET_SEMESTER', payload: val })}
          >
            <SelectTrigger className="mt-1.5 border-amber-200/50 focus-visible:ring-amber-500">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS[state.calendarType].map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {/* Introduction */}
        <div>
          <Label className="text-sm sm:text-base font-semibold">Introduction</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="relative">
                <div className="absolute left-3 top-3 text-base sm:text-lg">
                  {lang.flag}
                </div>
                <Textarea
                  value={state.intro[lang.code]}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_INTRO',
                      payload: { lang: lang.code, value: e.target.value },
                    })
                  }
                  placeholder={`Introduction (${lang.label})`}
                  className="pl-10 sm:pl-12 text-sm border-amber-200/50 focus-visible:ring-amber-500 min-h-[100px]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <Label className="text-sm sm:text-base font-semibold">Purpose / Why</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="relative">
                <div className="absolute left-3 top-3 text-base sm:text-lg">
                  {lang.flag}
                </div>
                <Textarea
                  value={state.why[lang.code]}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_WHY',
                      payload: { lang: lang.code, value: e.target.value },
                    })
                  }
                  placeholder={`Purpose / Why (${lang.label})`}
                  className="pl-10 sm:pl-12 text-sm border-amber-200/50 focus-visible:ring-amber-500 min-h-[100px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}