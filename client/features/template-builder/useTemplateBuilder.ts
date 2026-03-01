// features/template-builder/useTemplateBuilder.ts
import { useReducer, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { templateReducer, initialState } from './template.reducer';
import { validateTemplate } from './template.schema';
import type { TemplateFormState, Step, Language, QuestionType } from './template.types';

export function useTemplateBuilder(initialData?: Partial<TemplateFormState>, isEdit?: boolean) {
  const [state, dispatch] = useReducer(templateReducer, initialState);
  const { toast } = useToast();

  // Normalize initialData for edit mode
  function normalizeInitial(data: any): Partial<TemplateFormState> {
    if (!data) return {};
    return {
      name: data.name || { en: data.title || '', am: data.titleAm || '' },
      intro: data.intro || { en: data.description || '', am: data.descriptionAm || '' },
      why: data.why || { en: data.purpose || '', am: data.purposeAm || '' },
      academicYear: data.academicYear || '',
      semester: data.semester || '',
      calendarType: data.calendarType || 'ethiopian',
      questions: data.questions || [],
      id: data.id,
    };
  }

  // Load initial data for edit mode (or new)
  useEffect(() => {
    if (initialData) {
      dispatch({ type: 'LOAD_INITIAL', payload: normalizeInitial(initialData) });
    }
  }, [initialData]);

  // Update completed steps based on form state
  useEffect(() => {
    const detailsCompleted = Object.values(state.name).some(v => typeof v === 'string' && v.trim());
    if (detailsCompleted && !state.completedSteps.details) {
      dispatch({ 
        type: 'SET_CURRENT_STEP', 
        payload: state.currentStep 
      });
    }
  }, [state.name, state.completedSteps.details, state.currentStep]);

  // Form validation
  const isStepValid = useCallback((step: Step): boolean => {
    switch (step) {
      case 'details':
        return Object.values(state.name).some(v => typeof v === 'string' && v.trim().length > 0);
      case 'questions':
        return true; // Can have zero questions
      case 'preview':
        return Object.values(state.name).some(v => typeof v === 'string' && v.trim().length > 0);
      default:
        return false;
    }
  }, [state.name]);

  const canAddQuestion = Object.values(state.currentQuestion.text).some(t => t.trim().length > 0);

  // Navigation
  const goToNextStep = useCallback(() => {
    const steps: Step[] = ['details', 'questions', 'preview'];
    const currentIndex = steps.indexOf(state.currentStep);
    
    if (currentIndex < steps.length - 1) {
      if (state.currentStep === 'details' && !isStepValid('details')) {
        toast({
          title: 'Incomplete Details',
          description: 'Please fill in the template name before proceeding.',
          variant: 'destructive',
        });
        return;
      }
      dispatch({ type: 'SET_CURRENT_STEP', payload: steps[currentIndex + 1] });
    }
  }, [state.currentStep, isStepValid, toast]);

  const goToPreviousStep = useCallback(() => {
    const steps: Step[] = ['details', 'questions', 'preview'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: steps[currentIndex - 1] });
    }
  }, [state.currentStep]);

  // Question handlers
  const addQuestion = useCallback(() => {
    if (!canAddQuestion) {
      toast({
        title: 'Cannot Add Question',
        description: 'Please enter question text in at least one language.',
        variant: 'destructive',
      });
      return;
    }
    dispatch({ type: 'ADD_QUESTION' });
    toast({
      title: 'Question Added',
      description: 'Your question has been added to the template.',
    });
  }, [canAddQuestion, toast]);

  // Save handler with validation
  const saveTemplate = useCallback(async () => {
    // Ensure all multilingual fields are objects
    const toMultilingual = (val: any) => {
      if (!val) return { en: '', am: '' };
      if (typeof val === 'object') return val;
      return { en: val, am: '' };
    };
    const validation = validateTemplate({
      name: toMultilingual(state.name),
      intro: toMultilingual(state.intro),
      why: toMultilingual(state.why),
      calendarType: state.calendarType,
      academicYear: state.academicYear,
      semester: state.semester,
      questions: state.questions,
    });

    if (!validation.success) {
      let errorMsg = 'Please check your form data.';
      if (validation.error && Array.isArray(validation.error.errors) && validation.error.errors.length > 0) {
        errorMsg = validation.error.errors[0].message;
      }
      toast({
        title: 'Validation Error',
        description: errorMsg,
        variant: 'destructive',
      });
      // Remove failed/invalid template from state if present (for add mode)
      if (!isEdit) {
        dispatch({ type: 'RESET_FORM' });
      }
      return null;
    }

    dispatch({ type: 'SET_SAVING', payload: true });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: initialData ? 'Template Updated' : 'Template Created',
        description: `"${state.name.en || state.name.am}" has been saved successfully.`,
      });
      
      return validation.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, initialData, toast, isEdit]);

  return {
    state,
    dispatch,
    actions: {
      goToNextStep,
      goToPreviousStep,
      addQuestion,
      saveTemplate,
      isStepValid,
      canAddQuestion,
    },
  };
}