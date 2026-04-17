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

    // Try to get questions from different possible locations
    const questionsFromDB = data.questions || data.content?.questions || data.content || [];

    // Normalize questions from database format to reducer format
    const normalizedQuestions = (questionsFromDB || []).map((q: any) => {
      // If question already has the correct format, return as-is
      if (q.translations) {
        return q;
      }

      // Convert from database format to reducer format
      const normalized = {
        id: q.id || Math.random().toString(36).substr(2, 9),
        type: q.type || 'multiple',
        required: q.required !== undefined ? q.required : true,
        weight: q.weight || 3,
        translations: {
          en: q.text?.en || q.text ? {
            text: typeof q.text === 'string' ? q.text : (q.text?.en || ''),
            description: q.description?.en || (typeof q.description === 'string' ? q.description : ''),
          } : undefined,
          am: q.text?.am ? {
            text: q.text?.am || '',
            description: q.description?.am || '',
          } : undefined,
        },
        choices: q.choices || q.options || [],
      };
      return normalized;
    });

    return {
      name: typeof data.name === 'string' ? data.name : (data.name?.en || data.title || ''),
      intro: typeof data.intro === 'string' ? data.intro : (data.intro?.en || data.description || ''),
      why: typeof data.why === 'string' ? data.why : (data.why?.en || data.purpose || ''),
      academicYear: data.academicYear || '',
      semester: data.semester || '',
      targetAudience: data.targetAudience || 'student',
      calendarType: data.calendarType || 'gregorian',
      questions: normalizedQuestions,
    };
  }

  // Load initial data for edit mode (or new)
  useEffect(() => {
    if (initialData) {
      const normalized = normalizeInitial(initialData);
      dispatch({ type: 'LOAD_INITIAL', payload: normalized });
    }
  }, [initialData]);

  // Form validation
  const validateStep = useCallback((step: Step): boolean => {
    const nameValue = typeof state.name === 'string' ? state.name : (state.name as any)?.en || '';
    switch (step) {
      case 'details':
        return nameValue?.trim().length > 0;
      case 'questions':
        return true; // Can have zero questions
      case 'preview':
        return nameValue?.trim().length > 0;
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
      if (state.currentStep === 'details' && !validateStep('details')) {
        toast({
          title: 'Incomplete Details',
          description: 'Please fill in the template name before proceeding.',
          variant: 'destructive',
        });
        return;
      }
      dispatch({ type: 'SET_CURRENT_STEP', payload: steps[currentIndex + 1] });
    }
  }, [state.currentStep, validateStep, toast]);

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
    const validation = validateTemplate({
      name: state.name,
      intro: state.intro,
      why: state.why,
      calendarType: state.calendarType,
      academicYear: state.academicYear,
      semester: state.semester,
      questions: state.questions,
    });

    if (!validation.success) {
      let errorMsg = 'Please check your form data.';
      if (validation.error && Array.isArray(validation.error.issues) && validation.error.issues.length > 0) {
        errorMsg = validation.error.issues[0].message;
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
      // Return validated data for parent component to make API call
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
      validateStep,
      canAddQuestion,
    },
  };
}