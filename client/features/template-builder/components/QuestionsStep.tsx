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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Type, List, Edit2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TemplateFormState, TemplateFormAction, Language, QuestionType } from '../template.types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface QuestionsStepProps {
  state: TemplateFormState;
  dispatch: React.Dispatch<TemplateFormAction>;
  onAddQuestion: () => void;
  canAddQuestion: boolean;
}

const QUESTION_TYPES = [
  { value: 'multiple' as QuestionType, label: 'Multiple Choice', icon: <List className="h-4 w-4" /> },
  { value: 'paragraph' as QuestionType, label: 'Paragraph / Long Text', icon: <Type className="h-4 w-4" /> },
];

export function QuestionsStep({ state, dispatch, onAddQuestion, canAddQuestion }: QuestionsStepProps) {
  const { currentQuestion, questions, currentLang } = state;

  return (
    <div className="w-full space-y-4">
      {/* BUILDER SECTION */}
      <Card className="shadow-lg border-indigo-200/50 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-indigo-600" />
            Question Designer
          </CardTitle>
          <CardDescription className="text-xs">Configure your question parameters</CardDescription>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground cursor-pointer">Response Type</Label>
              <Select
                value={currentQuestion.type}
                onValueChange={(v: QuestionType) => dispatch({ type: 'SET_QUESTION_TYPE', payload: v })}
              >
                <SelectTrigger className="bg-white border-indigo-200 focus-visible:ring-indigo-500 h-9 text-sm cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="cursor-pointer">
                      <div className="flex items-center gap-2">{t.icon} {t.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground cursor-pointer">Requirement</Label>
              <Select
                value={currentQuestion.required ? 'yes' : 'no'}
                onValueChange={(v) => dispatch({ type: 'SET_QUESTION_REQUIRED', payload: v === 'yes' })}
              >
                <SelectTrigger className="bg-white border-indigo-200 focus-visible:ring-indigo-500 h-9 text-sm cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes" className="cursor-pointer">Mandatory</SelectItem>
                  <SelectItem value="no" className="cursor-pointer">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground cursor-pointer">Points / Weight</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={currentQuestion.weight}
                onChange={(e) => dispatch({ type: 'SET_QUESTION_WEIGHT', payload: parseInt(e.target.value) || 1 })}
                className="border-indigo-200 focus-visible:ring-indigo-500 h-9 text-sm cursor-pointer"
              />
            </div>
          </div>

          <Separator />

          {/* Text Inputs */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="q-text" className="text-sm font-semibold cursor-pointer">Question Label</Label>
              <Input
                id="q-text"
                value={currentQuestion.text[currentLang] || ''}
                onChange={(e) => dispatch({ type: 'SET_QUESTION_TEXT', payload: { lang: currentLang, value: e.target.value } })}
                placeholder="e.g., How would you rate our service?"
                className="text-sm py-3 border-indigo-200 focus-visible:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-desc" className="text-sm font-semibold text-muted-foreground cursor-pointer">Instructions (Optional)</Label>
              <Textarea
                id="q-desc"
                value={currentQuestion.description[currentLang] || ''}
                onChange={(e) => dispatch({ type: 'SET_QUESTION_DESC', payload: { lang: currentLang, value: e.target.value } })}
                placeholder="Provide additional context or help text..."
                className="resize-none border-indigo-200 focus-visible:ring-indigo-500 text-sm min-h-[80px] cursor-pointer"
              />
            </div>
          </div>

          {/* Conditional Multi-Choice Options */}
          {currentQuestion.type === 'multiple' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2.5 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-indigo-200"
            >
              <Label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <List className="h-4 w-4" /> Choice Options
              </Label>
              <div className="grid gap-2">
                {currentQuestion.choices.map((choice, idx) => (
                  <div key={choice.id} className="flex gap-2 items-center group">
                    <Badge variant="outline" className="h-8 w-8 shrink-0 justify-center border-indigo-200 text-indigo-600 text-xs">{idx + 1}</Badge>
                    <Input
                      value={choice.translations?.[currentLang] || choice.translations?.en || ''}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_CHOICE',
                        payload: { id: choice.id, lang: currentLang, value: e.target.value }
                      })}
                      placeholder={`Option ${idx + 1}`}
                      className="bg-white border-indigo-200 focus-visible:ring-indigo-500 h-8 text-sm cursor-pointer"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentQuestion.choices.length <= 1}
                      onClick={() => dispatch({ type: 'REMOVE_CHOICE', payload: choice.id })}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 h-8 text-sm cursor-pointer"
                onClick={() => dispatch({ type: 'ADD_CHOICE' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Choice
              </Button>
            </motion.div>
          )}

          <Button
            onClick={onAddQuestion}
            disabled={!canAddQuestion}
            className="w-full py-4 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Confirm & Add to List
          </Button>
        </CardContent>
      </Card>

      {/* TEMPLATE QUESTIONS LIST */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4">
          <div>
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <List className="h-4 w-4 text-indigo-600" />
              Template Questions ({questions.length})
            </CardTitle>
            <CardDescription className="text-xs">Questions added to this template</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-4 px-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No questions added yet. Create a new question using the designer above.
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] h-5 px-2">
                            {q.type === 'multiple' ? 'Multiple Choice' : 'Paragraph'}
                          </Badge>
                          {q.required && (
                            <Badge variant="outline" className="text-[10px] h-5 px-2 border-amber-200 text-amber-700">
                              Required
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {q.weight} pts
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {q.translations?.[currentLang]?.text || q.translations?.en?.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // Load question into editor for editing
                          const questionText = q.translations?.[currentLang]?.text || q.translations?.en?.text || '';
                          const questionDesc = q.translations?.[currentLang]?.description || q.translations?.en?.description || '';

                          dispatch({
                            type: 'SET_QUESTION_TEXT',
                            payload: { lang: currentLang, value: questionText }
                          });
                          dispatch({
                            type: 'SET_QUESTION_DESC',
                            payload: { lang: currentLang, value: questionDesc }
                          });
                          dispatch({
                            type: 'SET_QUESTION_TYPE',
                            payload: q.type
                          });
                          dispatch({
                            type: 'SET_QUESTION_REQUIRED',
                            payload: q.required
                          });
                          dispatch({
                            type: 'SET_QUESTION_WEIGHT',
                            payload: q.weight
                          });

                          // Load choices if it's a multiple choice question
                          if (q.type === 'multiple' && q.choices && q.choices.length > 0) {
                            // Clear existing choices first
                            const currentChoiceIds = currentQuestion.choices.map(c => c.id);
                            currentChoiceIds.forEach(id => {
                              dispatch({ type: 'REMOVE_CHOICE', payload: id });
                            });

                            // Add choices from the question with their text
                            q.choices.forEach((choice: any) => {
                              // Handle different choice text formats
                              let choiceText = '';
                              if (choice.translations) {
                                choiceText = choice.translations[currentLang] || choice.translations.en || '';
                              } else if (typeof choice === 'string') {
                                choiceText = choice;
                              }

                              // Add choice with initial text
                              dispatch({ type: 'ADD_CHOICE', payload: choiceText });
                            });
                          }

                          // Mark for editing (remove after add)
                          dispatch({ type: 'REMOVE_QUESTION', payload: q.id });
                        }}
                        className="h-7 w-7 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch({ type: 'REMOVE_QUESTION', payload: q.id })}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}