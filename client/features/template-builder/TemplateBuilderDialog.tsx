// features/template-builder/TemplateBuilderDialog.tsx
"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplateBuilder } from './useTemplateBuilder';
import { StepIndicator } from './components/StepIndicator';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { DetailsStep } from './components/DetailsStep';
import { QuestionsStep } from './components/QuestionsStep';
import { PreviewStep } from './components/PreviewStep';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getJwtToken } from '@/lib/auth';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: any) => void;
  initial?: any;
  isEdit?: boolean;
}

export function TemplateBuilderDialog({
  open,
  onOpenChange,
  onSave,
  initial,
  isEdit = false,
}: TemplateBuilderDialogProps) {
  const { state, dispatch, actions } = useTemplateBuilder(initial, isEdit);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  // Load initial data when dialog opens - with better debugging and transformation
  useEffect(() => {
    if (open && initial) {
      console.log("📥 Loading initial template data:", initial);
      const formattedInitial = {
        name: initial.name || { en: initial.title || '', am: initial.titleAm || '' },
        intro: initial.intro || { en: initial.description || '', am: initial.descriptionAm || '' },
        why: initial.why || { en: initial.purpose || '', am: initial.purposeAm || '' },
        academicYear: initial.academicYear || '',
        semester: initial.semester || '',
        calendarType: initial.calendarType || 'ethiopian',
        questions: initial.questions || [],
        id: initial.id,
      };
      console.log("📤 Formatted initial data:", formattedInitial);
      dispatch({ type: 'LOAD_INITIAL', payload: formattedInitial });
    }
  }, [open, initial, dispatch]);

  const handleCancel = () => {
    const hasChanges = Object.values(state.name).some(v => v) || state.questions.length > 0;
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleSave = async () => {
    try {
      const validated = await actions.saveTemplate();
      if (validated) {
        // Prepare payload for backend (always send multilingual fields as objects)
        const payload = {
          title: validated.name || { en: '', am: '' },
          description: validated.intro || { en: '', am: '' },
          intro: validated.intro || { en: '', am: '' },
          why: validated.why || { en: '', am: '' },
          content: validated,
          isDraft: false,
        };
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";
        const token = getJwtToken();
        const res = await fetch(`${apiBaseUrl}/api/templates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create template");
        onSave(await res.json());
        setTimeout(() => onOpenChange(false), 300);
      } else {
        // If save failed, stay on dialog and do not navigate
        console.error('Failed to save template: validation or API error');
      }
    } catch (error) {
      // Log error to console and stay on dialog
      console.error('Failed to save template:', error);
    }
  };

  const totalQuestions = state.questions.length;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 border-b bg-linear-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-t-2xl">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-rose-600 rounded-xl blur-lg opacity-40 animate-pulse" />
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-linear-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold truncate bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                  {initial ? 'Edit Template' : 'Create New Template'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Build your assessment template with multi-language support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="rounded-full px-2 sm:px-3 py-1 text-xs border-amber-200 dark:border-amber-800 bg-white/50 dark:bg-slate-900/50">
                <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                <span className="hidden xs:inline">{totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}</span>
                <span className="xs:hidden">{totalQuestions}</span>
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 hover:bg-rose-100/50 dark:hover:bg-rose-900/30"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher
          currentLang={state.currentLang}
          onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
        />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          onStepChange={(step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step })}
          completedSteps={state.completedSteps}
        />

        {/* Content Area */}
        <ScrollArea className="h-[calc(100vh-400px)] px-4 sm:px-6 py-4">
          <AnimatePresence mode="wait">
            <>
              {state.currentStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DetailsStep state={state} dispatch={dispatch} />
                </motion.div>
              )}

              {state.currentStep === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <QuestionsStep
                    state={state}
                    dispatch={dispatch}
                    onAddQuestion={actions.addQuestion}
                    canAddQuestion={actions.canAddQuestion}
                  />
                </motion.div>
              )}

              {state.currentStep === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PreviewStep state={state} />
                </motion.div>
              )}
            </>
          </AnimatePresence>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 pt-3 border-t bg-linear-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/20 dark:to-rose-950/20 rounded-b-2xl">
          <div className="flex flex-col-reverse sm:flex-row w-full gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:flex-1 rounded-full text-sm h-9 sm:h-10 border-amber-200/50 hover:bg-amber-50/50 transition-all"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Cancel
            </Button>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {state.currentStep !== 'details' && (
                <Button
                  variant="outline"
                  onClick={actions.goToPreviousStep}
                  className="flex-1 sm:flex-initial rounded-full text-sm h-9 sm:h-10 px-4 border-amber-200/50 hover:bg-amber-50/50 transition-all"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden xs:inline">Back</span>
                </Button>
              )}
              
              {state.currentStep !== 'preview' ? (
                <Button
                  onClick={actions.goToNextStep}
                  disabled={state.currentStep === 'details' && !actions.isStepValid('details')}
                  className="flex-1 sm:flex-initial rounded-full text-sm h-9 sm:h-10 px-6 bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={state.isSaving || !actions.isStepValid('details')}
                  className="flex-1 sm:flex-initial rounded-full text-sm h-9 sm:h-10 px-6 bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 min-w-25"
                >
                  {state.isSaving ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                      <span className="hidden xs:inline">Saving...</span>
                      <span className="xs:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      <span className="hidden xs:inline">{initial ? 'Update' : 'Create'}</span>
                      <span className="xs:hidden">Save</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}