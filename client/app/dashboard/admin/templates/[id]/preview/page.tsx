"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ArrowLeft,
  Eye,
  FileText,
  Calendar,
  User,
  Clock,
  BookOpen,
  Languages,
  Sparkles,
  Heart,
  Shield,
  CheckCircle2,
  AlertCircle,
  Globe,
  Download,
  Printer,
  Share2,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Grid3x3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import en from "zod/v4/locales/en.js";

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
  { code: "am" as Language, label: "አማርኛ", flag: "🇪🇹", dir: "ltr" },
];

// Pagination constants
const QUESTIONS_PER_PAGE = 5;

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
    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-xl border border-amber-200/50">
      <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <span className="text-sm font-medium text-amber-700 dark:text-amber-300 mr-2 hidden sm:inline">
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
              "rounded-full px-3 py-1 h-8 text-xs sm:text-sm transition-all",
              currentLang === lang.code && 
              "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 shadow-md"
            )}
          >
            <span className="mr-1 text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
      {availableLanguages.length === 1 && (
        <Badge variant="outline" className="rounded-full text-xs ml-2">
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
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="rounded-full text-xs px-3 py-1">
        <span className="mr-1">{typeIcons[type as keyof typeof typeIcons]}</span>
        {typeLabels[type as keyof typeof typeLabels]}
      </Badge>
      {required ? (
        <Badge className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-3 py-1">
          {language === 'am' ? 'የግድ' : 'Required'}
        </Badge>
      ) : (
        <Badge variant="outline" className="rounded-full text-xs px-3 py-1">
          {language === 'am' ? 'አማራጭ' : 'Optional'}
        </Badge>
      )}
      <Badge variant="outline" className="rounded-full text-xs px-3 py-1">
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
    <div className="flex items-center gap-2 mt-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "rounded-full text-[10px] px-2 py-1 cursor-help transition-colors",
                hasEn 
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400" 
                  : "opacity-40"
              )}
            >
              🇬🇧 EN
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {hasEn ? "English version available" : "English version not available"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "rounded-full text-[10px] px-2 py-1 cursor-help transition-colors",
                hasAm 
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400" 
                  : "opacity-40"
              )}
            >
              🇪🇹 አማ
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {hasAm ? "Amharic version available" : "Amharic version not available"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
    <Card className="border border-amber-200/50 dark:border-amber-800/50 hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white text-xs flex items-center justify-center font-medium shadow-sm">
            {index + 1}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <QuestionBadges 
                type={question.type} 
                required={question.required} 
                weight={question.weight}
                language={language}
              />
              <span className="text-xs text-muted-foreground">
                {index + 1} / {total}
              </span>
            </div>
            
            <div>
              <p className="font-medium text-base">
                {currentTranslation.text}
              </p>
              {currentTranslation.description && (
                <p className="text-sm text-muted-foreground mt-1 italic border-l-2 border-amber-300 pl-3">
                  {currentTranslation.description}
                </p>
              )}
            </div>

            <RadioGroup value={selected || ""} onValueChange={setSelected} className="space-y-2 mt-4">
              {question.choices?.map((choice, idx) => (
                <div key={choice.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice.id} id={choice.id} />
                  <Label htmlFor={choice.id} className="text-sm flex-1 cursor-pointer">
                    {choice.translations[language] || choice.translations.en}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <LanguageIndicators translations={question.translations} />
          </div>
        </div>
      </CardContent>
    </Card>
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
    <Card className="border border-amber-200/50 dark:border-amber-800/50 hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white text-xs flex items-center justify-center font-medium shadow-sm">
            {index + 1}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <QuestionBadges 
                type={question.type} 
                required={question.required} 
                weight={question.weight}
                language={language}
              />
              <span className="text-xs text-muted-foreground">
                {index + 1} / {total}
              </span>
            </div>

            <div>
              <p className="font-medium text-base">
                {currentTranslation.text}
              </p>
              {currentTranslation.description && (
                <p className="text-sm text-muted-foreground mt-1 italic border-l-2 border-amber-300 pl-3">
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
              className="min-h-[120px] resize-y"
            />

            <LanguageIndicators translations={question.translations} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuestionPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (
            page === currentPage - 2 ||
            page === currentPage + 2
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}
        
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"pagination" | "scroll">("pagination");

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

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = useMemo(() => {
    if (viewMode === "scroll") return filteredQuestions;
    
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, currentPage, viewMode]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
      <AdminDashboardLayout>
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !template) {
    return (
      <AdminDashboardLayout>
        <div className="p-4 sm:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Card className="border-rose-200">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-rose-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Template Not Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {error || "The template you're trying to preview doesn't exist or has been removed."}
              </p>
              <Button onClick={() => router.push("/dashboard/admin/templates")}>
                Return to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    );
  }

  const multipleChoiceCount = template.questions?.filter(q => q.type === "multiple").length || 0;
  const paragraphCount = template.questions?.filter(q => q.type === "paragraph").length || 0;

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto print:max-w-full print:p-0">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handlePrint} className="rounded-full">
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Link</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownload} className="rounded-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Preview Header Card */}
        <Card className="border-0 bg-gradient-to-br from-amber-500 to-rose-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <CardContent className="p-6 sm:p-8 relative">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 rounded-full px-3 py-1">
                <Eye className="h-3 w-3 mr-1" />
                {currentLang === 'am' ? 'ቅድመ እይታ' : 'Preview Mode'}
              </Badge>
              <div className="flex items-center gap-2">
                {template.status && (
                  <Badge className={cn(
                    "rounded-full px-3 py-1",
                    template.status === 'active' && "bg-emerald-500",
                    template.status === 'draft' && "bg-amber-500",
                    template.status === 'archived' && "bg-slate-500"
                  )}>
                    {template.status}
                  </Badge>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {template.name
                ? getLocalizedText(template.name)
                : getLocalizedText(undefined, template.title)}
            </h1>

            <p className="text-white/90 mb-4 max-w-2xl">
              {template.description && typeof template.description !== 'string'
                ? getLocalizedText(template.description)
                : getLocalizedText(undefined, typeof template.description === 'string' ? template.description : undefined)}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              {template.academicYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{template.academicYear}</span>
                </div>
              )}
              {template.semester && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{template.semester}</span>
                </div>
              )}
              {template.createdById && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Created by: {template.createdById}</span>
                </div>
              )}
              {template.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="text-2xl font-bold">{template.questions?.length || 0}</div>
                <div className="text-xs text-white/80">Total Questions</div>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="text-2xl font-bold">{multipleChoiceCount}</div>
                <div className="text-xs text-white/80">Multiple Choice</div>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="text-2xl font-bold">{paragraphCount}</div>
                <div className="text-xs text-white/80">Paragraph</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Switcher */}
        <LanguageSwitcher 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          availableLanguages={availableLanguages}
        />

        {/* Introduction and Purpose */}
        {((template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available") ||
          (template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available")) && (
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              {template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200/50">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">
                      {currentLang === 'am' ? '📋 መግቢያ:' : '📋 Introduction:'}
                    </span> {getLocalizedText(template.intro)}
                  </p>
                </div>
              )}

              {template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available" && (
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200/50">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-semibold">
                      {currentLang === 'am' ? '🎯 ዓላማ:' : '🎯 Purpose:'}
                    </span> {getLocalizedText(template.why)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* View Controls */}
        <div className="flex items-center justify-between">
          {/* Question Type Tabs */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all" className="gap-2">
                  <LayoutList className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'ሁሉም' : 'All'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {template.questions?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="multiple" className="gap-2">
                  <span>🔘</span>
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'ባለብዙ ምርጫ' : 'Multiple'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {multipleChoiceCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="paragraph" className="gap-2">
                  <span>📝</span>
                  <span className="hidden sm:inline">{currentLang === 'am' ? 'አንቀጽ' : 'Paragraph'}</span>
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                    {paragraphCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant={viewMode === "pagination" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("pagination")}
                  className="rounded-full h-8 w-8"
                  title={currentLang === 'am' ? 'የገጽ አመላካች' : 'Pagination'}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "scroll" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("scroll")}
                  className="rounded-full h-8 w-8"
                  title={currentLang === 'am' ? 'ማሸብለል' : 'Scroll'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Questions Display */}
            <div className="mt-6">
              {filteredQuestions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      {currentLang === 'am' 
                        ? 'ምንም ጥያቄዎች አልተገኙም' 
                        : 'No questions found'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedQuestions.map((question, idx) => {
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

                  {/* Pagination */}
                  {viewMode === "pagination" && totalPages > 1 && (
                    <QuestionPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <Card className="border-0 bg-gradient-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/20 dark:to-rose-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                <span className="text-muted-foreground">
                  {currentLang === 'am' 
                    ? 'ይህ ቅድመ እይታ እንዴት እንደሚታይ ለማሳየት ነው' 
                    : 'This preview shows how the template will appear'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">
                  {filteredQuestions.length} {currentLang === 'am' ? 'ጥያቄዎች' : 'questions'} • 
                  {viewMode === "pagination" ? 
                    `${currentLang === 'am' ? 'ገጽ' : 'Page'} ${currentPage} ${currentLang === 'am' ? 'ከ' : 'of'} ${totalPages}` : 
                    `${currentLang === 'am' ? 'ሁሉም ጥያቄዎች' : 'All questions'}`
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print Styles */}
        <style jsx global>{`
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
        `}</style>
      </div>
    </AdminDashboardLayout>
  );
}