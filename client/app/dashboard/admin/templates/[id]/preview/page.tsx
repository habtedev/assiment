"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  Printer,
  LayoutList,
  Maximize2,
  Minimize2,
  CheckCircle2,
  FileText,
  HelpCircle,
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
interface QuestionChoice {
  id: string;
  value: string;
  translations: Record<string, string>;
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
  name: Record<string, string>;
  title?: string;
  description?: string;
  intro?: Record<string, string>;
  why?: Record<string, string>;
  academicYear?: string;
  semester?: string;
  questions: Question[];
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "active" | "archived";
  questionCount?: number;
}

// Helper Components
const QuestionBadges = ({ type, required, weight }: {
  type: string;
  required: boolean;
  weight: number;
}) => {
  const typeLabels = {
    multiple: 'Multiple Choice',
    paragraph: 'Paragraph',
  };

  const typeIcons = {
    multiple: "🔘",
    paragraph: "📝",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="rounded-full text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800">
        <span className="mr-1.5">{typeIcons[type as keyof typeof typeIcons]}</span>
        {typeLabels[type as keyof typeof typeLabels]}
      </Badge>
      {required ? (
        <Badge className="rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-xs px-2.5 py-1 border-red-200 dark:border-red-800">
          Required
        </Badge>
      ) : (
        <Badge variant="outline" className="rounded-full text-xs px-2.5 py-1">
          Optional
        </Badge>
      )}
      <Badge variant="outline" className="rounded-full text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
        Weight: {weight}
      </Badge>
    </div>
  );
};

const ProgressIndicator = ({ current, total }: { current: number; total: number }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {current}/{total}
      </span>
    </div>
  );
};

const MultipleChoiceQuestion = ({ question, index, total, onAnswer }: {
  question: Question;
  index: number;
  total: number;
  onAnswer?: (questionId: string, answer: string) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const currentTranslation = question.translations.en || question.translations.am;

  if (!currentTranslation) return null;

  const handleSelect = (value: string) => {
    setSelected(value);
    onAnswer?.(question.id, value);
  };

  return (
    <div className="group relative">
      <div className="absolute -left-3 top-4 w-0.5 h-12 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all bg-white dark:bg-gray-900/50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center justify-center">
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <QuestionBadges
                type={question.type}
                required={question.required}
                weight={question.weight}
              />
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed">
                {currentTranslation.text}
              </p>
              {currentTranslation.description && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-indigo-300">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentTranslation.description}
                  </p>
                </div>
              )}
            </div>

            <RadioGroup value={selected || ""} onValueChange={handleSelect} className="space-y-2 mt-4">
              {question.choices?.map((choice, idx) => (
                <div 
                  key={choice.id} 
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    selected === choice.id && "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                  )}
                >
                  <RadioGroupItem value={choice.id} id={choice.id} />
                  <Label 
                    htmlFor={choice.id} 
                    className="text-sm flex-1 cursor-pointer font-normal text-gray-700 dark:text-gray-300"
                  >
                    {choice.translations.en || choice.translations.am}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParagraphQuestion = ({ question, index, total, onAnswer }: {
  question: Question;
  index: number;
  total: number;
  onAnswer?: (questionId: string, answer: string) => void;
}) => {
  const [answer, setAnswer] = useState("");
  const currentTranslation = question.translations.en || question.translations.am;

  if (!currentTranslation) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAnswer(value);
    onAnswer?.(question.id, value);
  };

  return (
    <div className="group relative">
      <div className="absolute -left-3 top-4 w-0.5 h-12 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all bg-white dark:bg-gray-900/50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center justify-center">
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <QuestionBadges
                type={question.type}
                required={question.required}
                weight={question.weight}
              />
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed">
                {currentTranslation.text}
              </p>
              {currentTranslation.description && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-indigo-300">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentTranslation.description}
                  </p>
                </div>
              )}
            </div>

            <Textarea
              value={answer}
              onChange={handleChange}
              placeholder="Type your answer here..."
              className="min-h-[120px] resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
  const [activeTab, setActiveTab] = useState<"all" | "multiple" | "paragraph">("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

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
        console.log("Fetched template data:", data); // Debug

        let questions = data.questions;
        if ((!questions || questions.length === 0) && data.content?.questions) {
          questions = data.content.questions;
        }
        if (questions) {
          questions.sort((a: Question, b: Question) => (a.order || 0) - (b.order || 0));
        }
        console.log("Questions after processing:", questions); // Debug
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

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const answeredCount = useMemo(() => {
    if (!template?.questions) return 0;
    const requiredQuestions = template.questions.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => answers[q.id] && answers[q.id].trim().length > 0);
    return answeredRequired.length;
  }, [template, answers]);

  const totalRequired = useMemo(() => {
    return template?.questions?.filter(q => q.required).length || 0;
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

  console.log("Filtered questions:", filteredQuestions); // Debug

  // Accepts Record<string, string> or string, returns best translation
  const getLocalizedText = useCallback((value: Record<string, string> | string | undefined, fallback?: string) => {
    if (!value && fallback) value = fallback;
    if (!value) return "No content available";
    if (typeof value === "string") return value;
    if (value.en && value.en.trim().length > 0) {
      return value.en;
    }
    if (value.am && value.am.trim().length > 0) {
      return value.am;
    }
    return "No content available";
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Template link has been copied to clipboard.",
    });
  };

  const handleDownload = () => {
    const exportData = {
      template: template,
      answers: answers,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `template-${template?.id}-response.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Response Saved",
      description: "Your responses have been downloaded as JSON.",
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Template Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
  const completionPercentage = totalRequired > 0 ? (answeredCount / totalRequired) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      <div ref={previewRef} className={cn("transition-all", isFullscreen && "bg-white dark:bg-black p-8")}>
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Desktop Header with Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 w-fit hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Button>

            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print Preview</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              

              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-2">
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Progress Bar (Desktop) */}
          {totalRequired > 0 && (
            <div className="print:hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Response Progress
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {answeredCount}/{totalRequired} required questions
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Preview Card */}
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            {/* Template Header with Gradient */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {template.status === 'active' ? 'Active Template' : template.status === 'draft' ? 'Draft' : 'Archived'}
                  </Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                  {template.name
                    ? getLocalizedText(template.name)
                    : getLocalizedText(undefined, template.title)}
                </h1>
                
                {(template.academicYear || template.semester) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {template.academicYear && (
                      <Badge variant="outline" className="border-white/30 text-white">
                        📅 {template.academicYear}
                      </Badge>
                    )}
                    {template.semester && (
                      <Badge variant="outline" className="border-white/30 text-white">
                        📚 {template.semester}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Introduction Section */}
            {((template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available") ||
              (template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available")) && (
              <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 p-6">
                <div className="space-y-4">
                  {template.intro && typeof template.intro !== 'string' && getLocalizedText(template.intro) !== "No content available" && (
                    <div className="flex gap-3">
                      <FileText className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Introduction
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getLocalizedText(template.intro)}
                        </p>
                      </div>
                    </div>
                  )}
                  {template.why && typeof template.why !== 'string' && getLocalizedText(template.why) !== "No content available" && (
                    <div className="flex gap-3">
                      <HelpCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Purpose
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getLocalizedText(template.why)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions Section */}
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                  <TabsList className="bg-transparent h-auto p-0 space-x-6">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 bg-transparent data-[state=active]:bg-transparent gap-2"
                    >
                      <LayoutList className="h-4 w-4" />
                      All Questions
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {template.questions?.length || 0}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="multiple" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 bg-transparent data-[state=active]:bg-transparent gap-2"
                    >
                      <span>🔘</span>
                      Multiple Choice
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {multipleChoiceCount}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="paragraph" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 pb-3 bg-transparent data-[state=active]:bg-transparent gap-2"
                    >
                      <span>📝</span>
                      Paragraph
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {paragraphCount}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Questions Display */}
                {filteredQuestions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No questions found in this category
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredQuestions.map((question, idx) => {
                      if (question.type === "multiple") {
                        return (
                          <MultipleChoiceQuestion
                            key={question.id}
                            question={question}
                            index={idx}
                            total={filteredQuestions.length}
                            onAnswer={handleAnswer}
                          />
                        );
                      } else {
                        return (
                          <ParagraphQuestion
                            key={question.id}
                            question={question}
                            index={idx}
                            total={filteredQuestions.length}
                            onAnswer={handleAnswer}
                          />
                        );
                      }
                    })}
                  </div>
                )}
              </Tabs>
            </div>

            {/* Footer Stats */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>
                    {filteredQuestions.length} questions in this form
                  </span>
                  {totalRequired > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{totalRequired} required</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}