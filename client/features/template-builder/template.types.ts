// features/template-builder/template.types.ts
export type Language = "en" | "am";
export type QuestionType = "multiple" | "paragraph";
export type CalendarType = "gregorian";
export type Step = "details" | "questions" | "preview";

export interface QuestionChoice {
  id: string;
  translations: Record<Language, string>;
}

export interface QuestionTranslation {
  text: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  required: boolean;
  weight: number;
  translations: Partial<Record<Language, QuestionTranslation>>;
  choices?: QuestionChoice[];
}

export interface TemplateFormState {
  // Basic info
  name: string;
  intro: string;
  why: string;

  // Calendar
  calendarType: CalendarType;
  academicYear: string;
  semester: string;
  targetAudience?: 'student' | 'college' | 'department';

  // Questions
  questions: Question[];

  // Current question being built
  currentQuestion: {
    type: QuestionType;
    required: boolean;
    weight: number;
    text: Record<Language, string>;
    description: Record<Language, string>;
    choices: QuestionChoice[];
  };

  // UI state
  currentStep: Step;
  currentLang: Language;
  isSaving: boolean;
  completedSteps: Record<Step, boolean>;
}

export type TemplateFormAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_INTRO'; payload: string }
  | { type: 'SET_WHY'; payload: string }
  | { type: 'SET_CALENDAR_TYPE'; payload: CalendarType }
  | { type: 'SET_ACADEMIC_YEAR'; payload: string }
  | { type: 'SET_SEMESTER'; payload: string }
  | { type: 'SET_TARGET_AUDIENCE'; payload: 'student' | 'college' | 'department' }
  | { type: 'SET_CURRENT_STEP'; payload: Step }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_QUESTION_TYPE'; payload: QuestionType }
  | { type: 'SET_QUESTION_REQUIRED'; payload: boolean }
  | { type: 'SET_QUESTION_WEIGHT'; payload: number }
  | { type: 'SET_QUESTION_TEXT'; payload: { lang: Language; value: string } }
  | { type: 'SET_QUESTION_DESC'; payload: { lang: Language; value: string } }
  | { type: 'ADD_CHOICE'; payload?: string }
  | { type: 'REMOVE_CHOICE'; payload: string }
  | { type: 'UPDATE_CHOICE'; payload: { id: string; lang: Language; value: string } }
  | { type: 'ADD_QUESTION' }
  | { type: 'REMOVE_QUESTION'; payload: string }
  | { type: 'MOVE_QUESTION'; payload: { index: number; direction: 'up' | 'down' } }
  | { type: 'DUPLICATE_QUESTION'; payload: Question }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_INITIAL'; payload: Partial<TemplateFormState> };