// features/template-builder/components/QuestionsStep.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, HelpCircle, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from './QuestionCard';
import type { TemplateFormState, TemplateFormAction, Language, QuestionType } from '../template.types';

interface QuestionsStepProps {
  state: TemplateFormState;
  dispatch: React.Dispatch<TemplateFormAction>;
  onAddQuestion: () => void;
  canAddQuestion: boolean;
}

const LANGUAGES = [
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'am' as Language, label: 'አማርኛ', flag: '🇪🇹' },
];

const QUESTION_TYPES = [
  { value: 'multiple' as QuestionType, label: 'Multiple Choice', icon: '🔘' },
  { value: 'paragraph' as QuestionType, label: 'Paragraph', icon: '📝' },
];

const WEIGHT_OPTIONS = [1, 2, 3, 4, 5];

export function QuestionsStep({ state, dispatch, onAddQuestion, canAddQuestion }: QuestionsStepProps) {
  return (
    <div className="space-y-6">
      {/* Add Question Form */}
      <Card className="border-0 bg-gradient-to-br from-amber-50/50 to-rose-50/50 dark:from-amber-950/20 dark:to-rose-950/20">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            Add New Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Question Type */}
            <div>
              <Label className="text-xs sm:text-sm">Question Type</Label>
              <Select
                value={state.currentQuestion.type}
                onValueChange={(v: QuestionType) =>
                  dispatch({ type: 'SET_QUESTION_TYPE', payload: v })
                }
              >
                <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm border-amber-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Required */}
            <div>
              <Label className="text-xs sm:text-sm">Required</Label>
              <Select
                value={state.currentQuestion.required ? 'yes' : 'no'}
                onValueChange={(v) =>
                  dispatch({ type: 'SET_QUESTION_REQUIRED', payload: v === 'yes' })
                }
              >
                <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm border-amber-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div>
              <Label className="text-xs sm:text-sm">Weight (1-5)</Label>
              <Select
                value={state.currentQuestion.weight.toString()}
                onValueChange={(v) =>
                  dispatch({ type: 'SET_QUESTION_WEIGHT', payload: parseInt(v) })
                }
              >
                <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm border-amber-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_OPTIONS.map((w) => (
                    <SelectItem key={w} value={w.toString()}>
                      {w} - {w === 1 ? 'Low' : w === 5 ? 'High' : 'Medium'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <Button
                onClick={onAddQuestion}
                disabled={!canAddQuestion}
                className="w-full h-9 sm:h-10 text-sm bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <Label className="text-xs sm:text-sm font-medium">Question Text</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.code} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg">
                    {lang.flag}
                  </div>
                  <Input
                    value={state.currentQuestion.text[lang.code]}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_QUESTION_TEXT',
                        payload: { lang: lang.code, value: e.target.value },
                      })
                    }
                    placeholder={`${lang.label}`}
                    className="pl-10 sm:pl-12 text-sm border-amber-200/50 focus-visible:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Question Description */}
          <div className="space-y-3">
            <Label className="text-xs sm:text-sm font-medium">Description (optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.code} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg">
                    {lang.flag}
                  </div>
                  <Input
                    value={state.currentQuestion.description[lang.code]}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_QUESTION_DESC',
                        payload: { lang: lang.code, value: e.target.value },
                      })
                    }
                    placeholder={`Description (${lang.label})`}
                    className="pl-10 sm:pl-12 text-sm border-amber-200/50 focus-visible:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Multiple Choice Options */}
          {state.currentQuestion.type === 'multiple' && (
            <div className="space-y-4">
              <Separator className="bg-amber-200/50" />
              <Label className="text-sm sm:text-base font-semibold">Answer Options</Label>

              {state.currentQuestion.choices.map((choice, index) => (
                <div
                  key={choice.id}
                  className="rounded-lg border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Option {index + 1}</span>
                    {state.currentQuestion.choices.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-rose-100/50 text-rose-600"
                        onClick={() => dispatch({ type: 'REMOVE_CHOICE', payload: choice.id })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LANGUAGES.map((lang) => (
                      <div key={lang.code} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg">
                          {lang.flag}
                        </div>
                        <Input
                          value={choice.translations[lang.code]}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_CHOICE',
                              payload: { id: choice.id, lang: lang.code, value: e.target.value },
                            })
                          }
                          placeholder={`${lang.label}`}
                          className="pl-10 sm:pl-12 text-sm border-amber-200/50 focus-visible:ring-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'ADD_CHOICE' })}
                className="w-full text-sm border-amber-200/50 hover:bg-amber-50/50 transition-all"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Option
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="h-5 w-5 text-amber-600">📋</span>
            Questions ({state.questions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-amber-200/50 rounded-xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
              <HelpCircle className="h-12 w-12 mx-auto text-amber-300 mb-3" />
              <p className="text-sm text-muted-foreground">No questions added yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add questions using the form above
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {state.questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    totalQuestions={state.questions.length}
                    currentLang={state.currentLang}
                    onMoveUp={() =>
                      dispatch({ type: 'MOVE_QUESTION', payload: { index, direction: 'up' } })
                    }
                    onMoveDown={() =>
                      dispatch({ type: 'MOVE_QUESTION', payload: { index, direction: 'down' } })
                    }
                    onDuplicate={() =>
                      dispatch({ type: 'DUPLICATE_QUESTION', payload: question })
                    }
                    onDelete={() =>
                      dispatch({ type: 'REMOVE_QUESTION', payload: question.id })
                    }
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}