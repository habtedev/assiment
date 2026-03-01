// features/template-builder/template.reducer.ts
import { TemplateFormState, TemplateFormAction } from './template.types';

const createEmptyChoice = () => ({
  id: Math.random().toString(36).substr(2, 9),
  translations: { en: '', am: '' },
});

const createEmptyQuestionText = () => ({ en: '', am: '' });

export const initialState: TemplateFormState = {
  name: { en: '', am: '' },
  intro: { en: '', am: '' },
  why: { en: '', am: '' },
  calendarType: 'ethiopian',
  academicYear: '',
  semester: '',
  questions: [],
  currentQuestion: {
    type: 'multiple',
    required: true,
    weight: 3,
    text: { en: '', am: '' },
    description: { en: '', am: '' },
    choices: [createEmptyChoice()],
  },
  currentStep: 'details',
  currentLang: 'en',
  isSaving: false,
  completedSteps: {
    details: false,
    questions: false,
    preview: false,
  },
};

export function templateReducer(
  state: TemplateFormState,
  action: TemplateFormAction
): TemplateFormState {
  console.log("🎬 Reducer action:", action.type, action); // Debug log
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: { ...state.name, [action.payload.lang]: action.payload.value },
      };

    case 'SET_INTRO':
      return {
        ...state,
        intro: { ...state.intro, [action.payload.lang]: action.payload.value },
      };

    case 'SET_WHY':
      return {
        ...state,
        why: { ...state.why, [action.payload.lang]: action.payload.value },
      };

    case 'SET_CALENDAR_TYPE':
      return {
        ...state,
        calendarType: action.payload,
        academicYear: '',
        semester: '',
      };

    case 'SET_ACADEMIC_YEAR':
      return { ...state, academicYear: action.payload };

    case 'SET_SEMESTER':
      return { ...state, semester: action.payload };

    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, currentLang: action.payload };

    case 'SET_QUESTION_TYPE':
      return {
        ...state,
        currentQuestion: { ...state.currentQuestion, type: action.payload },
      };

    case 'SET_QUESTION_REQUIRED':
      return {
        ...state,
        currentQuestion: { ...state.currentQuestion, required: action.payload },
      };

    case 'SET_QUESTION_WEIGHT':
      return {
        ...state,
        currentQuestion: { ...state.currentQuestion, weight: action.payload },
      };

    case 'SET_QUESTION_TEXT':
      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          text: { ...state.currentQuestion.text, [action.payload.lang]: action.payload.value },
        },
      };

    case 'SET_QUESTION_DESC':
      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          description: { ...state.currentQuestion.description, [action.payload.lang]: action.payload.value },
        },
      };

    case 'ADD_CHOICE':
      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          choices: [...state.currentQuestion.choices, createEmptyChoice()],
        },
      };

    case 'REMOVE_CHOICE':
      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          choices: state.currentQuestion.choices.filter(c => c.id !== action.payload),
        },
      };

    case 'UPDATE_CHOICE':
      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          choices: state.currentQuestion.choices.map(choice =>
            choice.id === action.payload.id
              ? {
                  ...choice,
                  translations: {
                    ...choice.translations,
                    [action.payload.lang]: action.payload.value,
                  },
                }
              : choice
          ),
        },
      };

    case 'ADD_QUESTION': {
      const canAdd = Object.values(state.currentQuestion.text).some(t => t.trim());
      if (!canAdd) return state;

      const newQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        type: state.currentQuestion.type,
        required: state.currentQuestion.required,
        weight: state.currentQuestion.weight,
        translations: {
          en: state.currentQuestion.text.en ? {
            text: state.currentQuestion.text.en,
            description: state.currentQuestion.description.en,
          } : undefined,
          am: state.currentQuestion.text.am ? {
            text: state.currentQuestion.text.am,
            description: state.currentQuestion.description.am,
          } : undefined,
        },
        choices: state.currentQuestion.type === 'multiple'
          ? state.currentQuestion.choices.filter(c => 
              Object.values(c.translations).some(t => t.trim())
            )
          : undefined,
      };

      return {
        ...state,
        questions: [...state.questions, newQuestion],
        currentQuestion: {
          type: 'multiple',
          required: true,
          weight: 3,
          text: { en: '', am: '' },
          description: { en: '', am: '' },
          choices: [createEmptyChoice()],
        },
      };
    }

    case 'REMOVE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload),
      };

    case 'MOVE_QUESTION': {
      const { index, direction } = action.payload;
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === state.questions.length - 1)
      ) {
        return state;
      }

      const newQuestions = [...state.questions];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      
      return { ...state, questions: newQuestions };
    }

    case 'DUPLICATE_QUESTION': {
      const duplicated = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      return {
        ...state,
        questions: [...state.questions, duplicated],
      };
    }

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    case 'RESET_FORM':
      return initialState;

    case 'LOAD_INITIAL': {
      // Ensure we properly load all fields
      const newState = {
        ...initialState, // Start with fresh state
        ...state, // Keep current state
        ...action.payload, // Override with payload
        name: {
          en: action.payload.name?.en || '',
          am: action.payload.name?.am || '',
        },
        intro: {
          en: action.payload.intro?.en || '',
          am: action.payload.intro?.am || '',
        },
        why: {
          en: action.payload.why?.en || '',
          am: action.payload.why?.am || '',
        },
        academicYear: action.payload.academicYear || '',
        semester: action.payload.semester || '',
        calendarType: action.payload.calendarType || 'ethiopian',
        questions: action.payload.questions || [],
        currentStep: 'details',
        currentLang: 'en',
        isSaving: false,
        completedSteps: {
          details: Boolean(action.payload.name?.en || action.payload.name?.am),
          questions: true,
          preview: Boolean(action.payload.name?.en || action.payload.name?.am),
        },
      };
      return newState;
    }

    default:
      return state;
  }
}