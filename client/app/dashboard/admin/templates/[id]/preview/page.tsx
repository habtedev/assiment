"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Heart,
  AlertCircle,
  Globe,
  Download,
  Printer,
  Share2,
  LayoutList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Types
type Language = "en" | "am";

interface QuestionChoice {
  id: string;
  value: string;
  translations: Record<Language, string>;
}

interface QuestionTranslation {
  text: string;
  description?: string;
}

interface Question {
  id: string;
  type: "multiple" | "paragraph";
  required: boolean;
  weight: number;
  order: number;
  translations: {
    en?: QuestionTranslation;
    am?: QuestionTranslation;
  };
  choices?: QuestionChoice[];
}

interface Template {
  id: string;
  name: Record<Language, string>;
  title?: string;
  description?: string;
  intro?: Record<Language, string>;
  why?: Record<Language, string>;
  academicYear?: string;
  semester?: string;
  questions: Question[];
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "active" | "archived";
  questionCount?: number;
}

// Language configuration
const LANGUAGES = [
  { code: "en" as Language, label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "am" as Language, label: "አማርኛ", flag: "🇪ᇹ", dir: "ltr" },
];

// Helper Components
const LanguageSwitcher = ({
  currentLang,
  onLanguageChange,
  availableLanguages
}: {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  availableLanguages: Language[];
}) => {
  const filteredLanguages = LANGUAGES.filter(lang =>
    availableLanguages.includes(lang.code)
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
      <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2 hidden sm:inline">
        Preview Language:
      </span>
      <div className="flex gap-1">
        {filteredLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLang === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              "rounded-lg px-3 py-1 h-7 text-xs sm:text-sm transition-all cursor-pointer",
              currentLang === lang.code &&
              "bg-indigo-600 text-white border-0"
            )}
          >
            <span className="mr-1 text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
      {availableLanguages.length === 1 && (
        <Badge variant="outline" className="rounded-full text-xs ml-2 border-gray-200 dark:border-gray-700">
          Only {availableLanguages[0] === 'en' ? 'English' : 'Amharic'} available
        </Badge>
      )}
    </div>
  );
};

const QuestionBadges = ({ type, required, weight, language }: {
  type: string;
  required: boolean;
  weight: number;
  language: Language;
}) => {
  const typeLabels = {
    multiple: language === 'am' ? 'ባለብዙ ምርጫ' : 'Multiple Choice',
    paragraph: language === 'am' ? 'አንቀጽ' : 'Paragraph',
  };

  const typeIcons = {
    multiple: "🔘",
    paragraph: "📝",
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        <span className="mr-1">{typeIcons[type as keyof typeof typeIcons]}</span>
        {typeLabels[type as keyof typeof typeLabels]}
      </Badge>
      {required ? (
        <Badge className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs px-2 py-0.5">
          {language === 'am' ? 'የግድ' : 'Required'}
        </Badge>
      ) : (
        <Badge variant="outline" className="rounded-full text-xs px-2 py-0.5 border-gray-200 dark:border-gray-700">
          {language === 'am' ? 'አማራጭ' : 'Optional'}
        </Badge>
      )}
      <Badge variant="outline" className="rounded-full text-xs px-2 py-0.5 border-gray-200 dark:border-gray-700">
        {language === 'am' ? `ክብደት: ${weight}` : `Weight: ${weight}`}
      </Badge>
    </div>
  );
};

const LanguageIndicators = ({ translations }: {
  translations: { en?: QuestionTranslation; am?: QuestionTranslation }
}) => {
const hasEn = !!translations.en?.text && translations.en.text.trim().length > 0;
  const hasAm = !!translations.am?.text && translations.am.text.trim().length > 0;

  if (!hasEn && !hasAm) return null;

  return (
    <div className="flex items-center gap-1.5 mt-2">
      
    </div>
  );
};

const MultipleChoiceQuestion = ({ question, index, language, total }: {
  question: Question;
  index: number;
  language: Language;
  total: number;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const currentTranslation = question.translations[language] || question.translations.en;

  if (!currentTranslation) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-all bg-white dark:bg-black p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-medium">
          {index + 1}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <QuestionBadges
              type={question.type}
              required={question.required}
              weight={question.weight}
              language={language}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {index + 1} / {total}
            </span>
          </div>

          <div>
            <p className="font-medium text-sm">
              {currentTranslation.text}
            </p>
            {currentTranslation.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic border-l-2 border-indigo-300 pl-3">
                {currentTranslation.description}
              </p>
            )}
          </div>

          <RadioGroup value={selected || ""} onValueChange={setSelected} className="space-y-1.5 mt-3">
            {question.choices?.map((choice, idx) => (
              <div key={choice.id} className="flex items-center space-x-2">
                <RadioGroupItem value={choice.id} id={choice.id} />
                <Label htmlFor={choice.id} className="text-xs flex-1 cursor-pointer">
                  {choice.translations[language] || choice.translations.en}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <LanguageIndicators translations={question.translations} />
        </div>
      </div>
    </div>
  );
};

const ParagraphQuestion = ({ question, index, language, total }: {
  question: Question;
  index: number;
  language: Language;
  total: number;
}) => {
  const [answer, setAnswer] = useState("");
  const currentTranslation = question.translations[language] || question.translations.en;

  if (!currentTranslation) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-all bg-white dark:bg-black p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-medium">
          {index + 1}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <QuestionBadges
              type={question.type}
              required={question.required}
              weight={question.weight}
              language={language}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {index + 1} / {total}
            </span>
          </div>

          <div>
            <p className="font-medium text-sm">
              {currentTranslation.text}
            </p>
            {currentTranslation.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic border-l-2 border-indigo-300 pl-3">
                {currentTranslation.description}
              </p>
            )}
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={language === 'am'
              ? "መልስዎን እዚህ ያስገቡ..."
              : "Enter your answer here..."
            }
            className="min-h-[80px] resize-y cursor-pointer"
          />

          <LanguageIndicators translations={question.translations} />
        </div>
      </div>
    </div>
  );
};

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<"all" | "multiple" | "paragraph">("all");

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const unwrappedParams = await params;
        const templateId = unwrappedParams.id;

        const res = await fetch(`${API_BASE_URL}/api/templates/${templateId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Template not found");
          }
          throw new Error("Failed to fetch template");
        }

        const data = await res.json();

        // Fix: If questions are inside content, merge them to top-level for preview
        let questions = data.questions;
        if ((!questions || questions.length === 0) && data.content?.questions) {
          questions = data.content.questions;
        }
        if (questions) {
          questions.sort((a: Question, b: Question) => (a.order || 0) - (b.order || 0));
        }
        setTemplate({ ...data, questions });
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [params, toast]);

  // Get available languages from template
  const availableLanguages = useMemo(() => {
    if (!template) return ["en"] as Language[];
    
    const langs: Language[] = ["en"];
    
    // Check if any question has Amharic translation
    const hasAmharic = template.questions?.some(q => 
      q.translations.am?.text && q.translations.am.text.trim().length > 0
    );
    
    if (hasAmharic) {
      langs.push("am");
    }
    
    return langs;
  }, [template]);

  // Filter questions based on active tab
  const filteredQuestions = useMemo(() => {
    if (!template?.questions) return [];

    if (activeTab === "multiple") {
      return template.questions.filter(q => q.type === "multiple");
    } else if (activeTab === "paragraph") {
      return template.questions.filter(q => q.type === "paragraph");
    }
    return template.questions;
  }, [template, activeTab]);

  // Accepts Record<Language, string> or string, returns best translation, supports fallback for template.title
  const getLocalizedText = useCallback((value: Record<Language, string> | string | undefined, fallback?: string) => {
    if (!value && fallback) value = fallback;
    if (!value) return "No content available";
    if (typeof value === "string") return value;
    // Try current language
    if (value[currentLang] && value[currentLang]?.trim().length > 0) {
      return value[currentLang]!;
    }
    // Fallback to English
    if (value.en && value.en.trim().length > 0) {
      return value.en;
    }
    // Fallback to Amharic
    if (value.am && value.am.trim().length > 0) {
      return value.am;
    }
    return "No content available";
  }, [currentLang]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "✅ Link Copied",
      description: "Template link has been copied to clipboard.",
    });
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `template-${template?.id}-preview.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "✅ Template Downloaded",
      description: "Template data has been downloaded as JSON.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mb-4 h-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="border border-red-200 dark:border-red-800 max-w-2xl mx-auto">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-3" />
              <h2 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white">Template Not Found</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {error || "The template you're trying to preview doesn't exist or has been removed."}
              </p>
              <Button onClick={() => router.push("/dashboard/admin/templates")} className="cursor-pointer">
                Return to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const multipleChoiceCount = template.questions?.filter(q => q.type === "multiple").length || 0;
  const paragraphCount = template.questions?.filter(q => q.type === "paragraph").length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto p-4 space-y-4 print:p-0 print:max-w-none">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 w-fit h-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handlePrint} className="rounded-lg h-8 w-8 cursor-pointer">
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShare} className="rounded-lg h-8 w-8 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Link</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownload} className="rounded-lg h-8 w-8 cursor-pointer">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Combined Preview Card */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
          {/* Template Header */}
          <CardContent className="p-4 sm:p-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h1 className="text-xl sm:text-2xl font-bold mb-1.5 text-gray-900 dark:text-white">
              {template.name
                ? getLocalizedText(template.name)
                : getLocalizedText(undefined, template.title)}
            </h1>
            <p className="mb-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              {template.description && typeof template.description !== 'string'
                ? getLocalizedText(template.description)
                : getLocalizedText(undefined, typeof template.description === 'string' ? template.description : undefined)}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
              {template.academicYear && (
                <div>{template.academicYear}</div>
              )}
              {template.semester && (
                <div>{template.semester}</div>
              )}
            </div>
          </CardContent>

          {/* Introduction and Purpose */}
          {((template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available") ||
            (template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available")) && (
            <CardContent className="p-4 pb-3 border-b border-gray-100 dark:border-gray-800 space-y-3">
              {template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available" && (
                <div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Introduction:</span> {getLocalizedText(template.intro)}
                  </p>
                </div>
              )}
              {template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available" && (
                <div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Purpose:</span> {getLocalizedText(template.why)}
                  </p>
                </div>
              )}
            </CardContent>
          )}

          {/* View Controls */}
          <CardContent className="p-4 pb-3">
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
                <TabsTrigger value="all" className="gap-2 text-xs">
                  <LayoutList className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'ሁሉም' : 'All'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {template.questions?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="multiple" className="gap-2 text-xs">
                  <span>🔘</span>
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'ባለብዙ ምርጫ' : 'Multiple'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {multipleChoiceCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="paragraph" className="gap-2 text-xs">
                  <span>📝</span>
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'አንቀጽ' : 'Paragraph'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {paragraphCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Questions Display */}
              {filteredQuestions.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'am'
                      ? 'ምንም ጥያቄዎች አልተገኙም'
                      : 'No questions found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((question, idx) => {
                    const globalIndex = filteredQuestions.indexOf(question);
                    if (question.type === "multiple") {
                      return (
                        <MultipleChoiceQuestion
                          key={question.id}
                          question={question}
                          index={globalIndex}
                          language={currentLang}
                          total={filteredQuestions.length}
                        />
                      );
                    } else {
                      return (
                        <ParagraphQuestion
                          key={question.id}
                          question={question}
                          index={globalIndex}
                          language={currentLang}
                          total={filteredQuestions.length}
                        />
                      );
                    }
                  })}
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="border-0 bg-gray-50 dark:bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs">
              <Heart className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {currentLang === 'am'
                  ? 'ይህ ቅድመ እይታ እንዴት እንደሚታይ ለማሳየት ነው'
                  : 'This preview shows how the template will appear'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">
                {filteredQuestions.length} {currentLang === 'am' ? 'ጥያቄዎች' : 'questions'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Print Styles */}
        {/* <style jsx global>{`
          @media print {
            body {
              background: white;
              padding: 20px;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:max-w-full {
              max-width: 100% !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
          }
        `}</style> */}
      </div>
    </div>
  );
}