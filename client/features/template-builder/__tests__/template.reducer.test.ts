// features/template-builder/__tests__/template.reducer.test.ts
import { templateReducer, initialState } from '../template.reducer';

describe('templateReducer', () => {
  test('should set name correctly', () => {
    const state = templateReducer(initialState, {
      type: 'SET_NAME',
      payload: { lang: 'en', value: 'Test Template' },
    });
    expect(state.name.en).toBe('Test Template');
  });

  test('should set intro correctly', () => {
    const state = templateReducer(initialState, {
      type: 'SET_INTRO',
      payload: { lang: 'en', value: 'Test Introduction' },
    });
    expect(state.intro.en).toBe('Test Introduction');
  });

  test('should set calendar type and reset year/semester', () => {
    // First set some values
    let state = templateReducer(initialState, {
      type: 'SET_ACADEMIC_YEAR',
      payload: '2023/24',
    });
    state = templateReducer(state, {
      type: 'SET_SEMESTER',
      payload: 'Semester I',
    });

    // Then change calendar type
    state = templateReducer(state, {
      type: 'SET_CALENDAR_TYPE',
      payload: 'gregorian',
    });

    expect(state.calendarType).toBe('gregorian');
    expect(state.academicYear).toBe('');
    expect(state.semester).toBe('');
  });

  test('should add a question when text is provided', () => {
    // Set question text
    let state = templateReducer(initialState, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Test Question' },
    });

    const initialLength = state.questions.length;
    state = templateReducer(state, { type: 'ADD_QUESTION' });

    expect(state.questions.length).toBe(initialLength + 1);
    expect(state.questions[0].translations.en?.text).toBe('Test Question');
    expect(state.currentQuestion.text.en).toBe(''); // Should reset
  });

  test('should not add question without text', () => {
    const initialStateCopy = { ...initialState };
    const state = templateReducer(initialStateCopy, { type: 'ADD_QUESTION' });
    expect(state.questions.length).toBe(0);
  });

  test('should remove a question', () => {
    // Add a question first
    let state = templateReducer(initialState, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Test Question' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });
    
    const questionId = state.questions[0].id;
    const initialLength = state.questions.length;

    state = templateReducer(state, {
      type: 'REMOVE_QUESTION',
      payload: questionId,
    });

    expect(state.questions.length).toBe(initialLength - 1);
  });

  test('should move question up', () => {
    // Add two questions
    let state = initialState;
    
    // First question
    state = templateReducer(state, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Question 1' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });
    
    // Second question
    state = templateReducer(state, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Question 2' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });

    expect(state.questions[0].translations.en?.text).toBe('Question 1');
    expect(state.questions[1].translations.en?.text).toBe('Question 2');

    // Move second question up
    state = templateReducer(state, {
      type: 'MOVE_QUESTION',
      payload: { index: 1, direction: 'up' },
    });

    expect(state.questions[0].translations.en?.text).toBe('Question 2');
    expect(state.questions[1].translations.en?.text).toBe('Question 1');
  });

  test('should move question down', () => {
    // Add two questions
    let state = initialState;
    
    state = templateReducer(state, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Question 1' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });
    
    state = templateReducer(state, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Question 2' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });

    // Move first question down
    state = templateReducer(state, {
      type: 'MOVE_QUESTION',
      payload: { index: 0, direction: 'down' },
    });

    expect(state.questions[0].translations.en?.text).toBe('Question 2');
    expect(state.questions[1].translations.en?.text).toBe('Question 1');
  });

  test('should duplicate a question', () => {
    // Add a question
    let state = templateReducer(initialState, {
      type: 'SET_QUESTION_TEXT',
      payload: { lang: 'en', value: 'Original Question' },
    });
    state = templateReducer(state, { type: 'ADD_QUESTION' });

    const originalQuestion = state.questions[0];
    const initialLength = state.questions.length;

    state = templateReducer(state, {
      type: 'DUPLICATE_QUESTION',
      payload: originalQuestion,
    });

    expect(state.questions.length).toBe(initialLength + 1);
    expect(state.questions[1].translations.en?.text).toBe('Original Question');
    expect(state.questions[1].id).not.toBe(originalQuestion.id);
  });

  test('should add a choice', () => {
    const initialChoicesLength = initialState.currentQuestion.choices.length;
    const state = templateReducer(initialState, { type: 'ADD_CHOICE' });
    expect(state.currentQuestion.choices.length).toBe(initialChoicesLength + 1);
  });

  test('should remove a choice', () => {
    // Add a choice first
    let state = templateReducer(initialState, { type: 'ADD_CHOICE' });
    const choiceId = state.currentQuestion.choices[1].id;
    const initialLength = state.currentQuestion.choices.length;

    state = templateReducer(state, {
      type: 'REMOVE_CHOICE',
      payload: choiceId,
    });

    expect(state.currentQuestion.choices.length).toBe(initialLength - 1);
  });

  test('should update a choice', () => {
    const choiceId = initialState.currentQuestion.choices[0].id;
    const state = templateReducer(initialState, {
      type: 'UPDATE_CHOICE',
      payload: { id: choiceId, lang: 'en', value: 'Updated Choice' },
    });

    expect(state.currentQuestion.choices[0].translations.en).toBe('Updated Choice');
  });

  test('should set saving state', () => {
    const state = templateReducer(initialState, {
      type: 'SET_SAVING',
      payload: true,
    });
    expect(state.isSaving).toBe(true);
  });

  test('should reset form', () => {
    // First make some changes
    let state = templateReducer(initialState, {
      type: 'SET_NAME',
      payload: { lang: 'en', value: 'Test' },
    });
    state = templateReducer(state, { type: 'SET_SAVING', payload: true });

    // Then reset
    state = templateReducer(state, { type: 'RESET_FORM' });

    expect(state.name.en).toBe('');
    expect(state.isSaving).toBe(false);
    expect(state.questions.length).toBe(0);
  });

  test('should load initial data', () => {
    const initialData = {
      name: { en: 'Loaded Template', am: '' },
      questions: [{ id: '1', type: 'multiple' as const, required: true, weight: 3, translations: {} }],
    };

    const state = templateReducer(initialState, {
      type: 'LOAD_INITIAL',
      payload: initialData,
    });

    expect(state.name.en).toBe('Loaded Template');
    expect(state.questions.length).toBe(1);
    expect(state.currentStep).toBe('details'); // Should reset to details
  });
});