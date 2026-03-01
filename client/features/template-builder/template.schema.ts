import { z } from 'zod';

// Language-specific schema - at least one language required
const languageString = z.object({
  en: z.string().optional(),
  am: z.string().optional(),
}).refine(data => data.en?.trim() || data.am?.trim(), {
  message: "At least one language translation is required",
});

// Question choice schema
const questionChoiceSchema = z.object({
  id: z.string(),
  translations: z.object({
    en: z.string().optional(),
    am: z.string().optional(),
  }),
});

// Question translation schema
const questionTranslationSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
});

// Question schema
const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple', 'paragraph']),
  required: z.boolean(),
  weight: z.number().min(1).max(5),
  translations: z.object({
    en: questionTranslationSchema.optional(),
    am: questionTranslationSchema.optional(),
  }),
  choices: z.array(questionChoiceSchema).optional(),
});

// Main template schema
export const templateSchema = z.object({
  name: z.object({
    en: z.string().optional(),
    am: z.string().optional(),
  }).refine(data => data.en?.trim() || data.am?.trim(), {
    message: "Template name is required in at least one language",
  }),
  intro: z.object({
    en: z.string().optional(),
    am: z.string().optional(),
  }),
  why: z.object({
    en: z.string().optional(),
    am: z.string().optional(),
  }),
  calendarType: z.enum(['ethiopian', 'gregorian']),
  academicYear: z.string().min(1, "Academic year is required"),
  semester: z.string().min(1, "Semester is required"),
  questions: z.array(questionSchema),
});

export type ValidatedTemplate = z.infer<typeof templateSchema>;

// Validation helper
export const validateTemplate = (data: unknown) => {
  return templateSchema.safeParse(data);
};