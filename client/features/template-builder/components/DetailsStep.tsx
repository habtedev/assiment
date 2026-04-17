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
import type { TemplateFormState, TemplateFormAction } from '../template.types';
import { cn } from '@/lib/utils';
import { SEMESTERS } from '../constants/semesters';
import { ACADEMIC_YEARS } from '../constants/academicYears';

interface DetailsStepProps {
  state: TemplateFormState;
  dispatch: React.Dispatch<TemplateFormAction>;
}

export function DetailsStep({ state, dispatch }: DetailsStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        {/* Template Name */}
        <div>
          <Label className="text-sm font-semibold flex items-center gap-2">
            Template Name
            <span className="text-rose-500">*</span>
            {!state.name && (
              <Badge variant="outline" className="text-indigo-600 border-indigo-200 text-[10px]">
                Required
              </Badge>
            )}
          </Label>
          <Input
            value={state.name}
            onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
            placeholder="Enter template name"
            className="mt-1.5 text-sm border-indigo-200/50 focus-visible:ring-indigo-500 h-9 cursor-pointer"
            required
          />
        </div>
        {/* Academic Year */}
        <div>
          <Label className="text-sm font-semibold">Academic Year</Label>
          <Select
            value={state.academicYear}
            onValueChange={(val) => dispatch({ type: 'SET_ACADEMIC_YEAR', payload: val })}
          >
            <SelectTrigger className="mt-1.5 border-indigo-200/50 focus-visible:ring-indigo-500 h-9 cursor-pointer">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.gregorian.map((year) => (
                <SelectItem key={year} value={year} className="cursor-pointer">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester */}
        <div>
          <Label className="text-sm font-semibold">Semester</Label>
          <Select
            value={state.semester}
            onValueChange={(val) => dispatch({ type: 'SET_SEMESTER', payload: val })}
          >
            <SelectTrigger className="mt-1.5 border-indigo-200/50 focus-visible:ring-indigo-500 h-9 cursor-pointer">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.gregorian.map((sem) => (
                <SelectItem key={sem} value={sem} className="cursor-pointer">
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Audience */}
        <div>
          <Label className="text-sm font-semibold">Target Audience</Label>
          <Select
            value={state.targetAudience || 'student'}
            onValueChange={(val) => dispatch({ type: 'SET_TARGET_AUDIENCE', payload: val as 'student' | 'college' | 'department' })}
          >
            <SelectTrigger className="mt-1.5 border-indigo-200/50 focus-visible:ring-indigo-500 h-9 cursor-pointer">
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student" className="cursor-pointer">Student</SelectItem>
              <SelectItem value="college" className="cursor-pointer">College</SelectItem>
              <SelectItem value="department" className="cursor-pointer">Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {/* Introduction */}
        <div>
          <Label className="text-sm font-semibold">Introduction</Label>
          <div className="grid grid-cols-1 gap-2 mt-1.5">
            <div>
              <Textarea
                value={state.intro}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_INTRO',
                    payload: e.target.value,
                  })
                }
                placeholder="Enter a clear and concise introduction for this template."
                className="text-sm border-indigo-200/50 focus-visible:ring-indigo-500 min-h-[80px] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <Label className="text-sm font-semibold">Purpose / Why</Label>
          <div className="grid grid-cols-1 gap-2 mt-1.5">
            <div>
              <Textarea
                value={state.why}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_WHY',
                    payload: e.target.value,
                  })
                }
                placeholder="Describe the main purpose or goal of this template."
                className="text-sm border-indigo-200/50 focus-visible:ring-indigo-500 min-h-[80px] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}