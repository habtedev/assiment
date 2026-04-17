"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplateBuilder } from './useTemplateBuilder';
import { StepIndicator } from './components/StepIndicator';
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
import { X, ArrowLeft, ArrowRight, Save, Loader2, Sparkles } from 'lucide-react';
import { getJwtToken } from '@/lib/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    if (open && initial) {
      const formattedInitial = {
        name: initial.name || initial.title || { en: '' },
        intro: initial.intro || initial.description || { en: '' },
        why: initial.why || initial.purpose || { en: '' },
        academicYear: initial.academicYear || '',
        semester: initial.semester || '',
        calendarType: initial.calendarType || 'ethiopian',
        questions: initial.questions || initial.content?.questions || [],
        id: initial.id,
      };
      dispatch({ type: 'LOAD_INITIAL', payload: formattedInitial });
    }
  }, [open, initial, dispatch]);

  const handleCancel = () => {
    const hasChanges = state.name?.trim() || state.questions.length > 0;
    if (hasChanges && !isEdit) {
      setShowCancelDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const validatedData = await actions.saveTemplate();
      if (!validatedData) return;

      // If in edit mode, just return validated data to parent component
      if (isEdit) {
        const payload = {
          name: validatedData.name,
          description: validatedData.intro,
          intro: validatedData.intro,
          why: validatedData.why,
          questions: validatedData.questions,
          calendarType: validatedData.calendarType,
          academicYear: validatedData.academicYear,
          semester: validatedData.semester,
          isDraft: false,
        };
        await onSave(payload);
        onOpenChange(false);
        return;
      }

      // For new templates, make API call
      const payload = {
        name: validatedData.name,
        description: validatedData.intro,
        intro: validatedData.intro,
        why: validatedData.why,
        questions: validatedData.questions,
        calendarType: validatedData.calendarType,
        academicYear: validatedData.academicYear,
        semester: validatedData.semester,
        isDraft: false,
      };

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";
      const token = getJwtToken();

      const res = await fetch(`${apiBaseUrl}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save template");

      const savedTemplate = await res.json();
      onSave(savedTemplate);
      onOpenChange(false);
    } catch (error) {
      console.error('Save Error:', error);
      toast({
        title: "❌ Error",
        description: isEdit ? "Failed to update template. Please try again." : "Failed to create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">

        {/* Compact Modern Header */}
        <header className="px-6 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  {isEdit ? 'Edit Template' : 'Create New Template'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isEdit ? 'Modify your existing template' : 'Design a new evaluation form'}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-red-100 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-600 transition-colors h-8 w-8 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70">
          <StepIndicator
            currentStep={state.currentStep}
            onStepChange={(step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step })}
            completedSteps={state.completedSteps}
          />
        </div>

        {/* Main Content - More Compact */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {state.currentStep === 'details' && <DetailsStep state={state} dispatch={dispatch} />}
                {state.currentStep === 'questions' && (
                  <QuestionsStep
                    state={state}
                    dispatch={dispatch}
                    onAddQuestion={actions.addQuestion}
                    canAddQuestion={actions.canAddQuestion}
                  />
                )}
                {state.currentStep === 'preview' && <PreviewStep state={state} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Clean Footer */}
        <footer className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="flex items-center justify-center w-full gap-4">
            {state.currentStep !== 'details' && (
              <Button
                variant="outline"
                onClick={actions.goToPreviousStep}
                className="gap-2 px-6 py-2.5 text-sm font-medium cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}

            {state.currentStep !== 'preview' ? (
              <Button
                onClick={actions.goToNextStep}
                disabled={!actions.validateStep(state.currentStep)}
                className="gap-3 px-8 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all rounded-lg cursor-pointer"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSubmitting || !actions.validateStep('details')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all rounded-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Update Template' : 'Publish Template'}
                  </>
                )}
              </Button>
            )}
          </div>
        </footer>
      </div>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-rose-600">
              Discard this template?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              All progress will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">Keep Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onOpenChange(false)}
              className="bg-rose-600 hover:bg-rose-700 rounded-2xl"
            >
              Yes, Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}