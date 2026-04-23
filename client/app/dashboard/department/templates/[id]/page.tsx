"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, AlertCircle, FileText, HelpCircle, 
  Send, Eye, BookOpen, CheckCircle2, Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AdminDashboardLayout } from "@/components/dashboard/department/layout/DepartmentLayout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// ============== TYPES ==============
interface Question {
  id: string;
  type: "multiple" | "paragraph";
  required: boolean;
  weight: number;
  order: number;
  translations: { en?: { text: string; description?: string }; am?: { text: string; description?: string } };
  choices?: { id: string; value: string; translations: Record<string, string> }[];
}

interface Template {
  id: string;
  name: Record<string, string>;
  title?: string;
  intro?: Record<string, string>;
  why?: Record<string, string>;
  academicYear?: string;
  semester?: string;
  questions: Question[];
  status?: string;
}

// ============== UTILS ==============
const cnClasses = (...args: any[]) => args.filter(Boolean).join(" ");

// ============== COMPACT QUESTION COMPONENTS ==============
const QuestionMeta = ({ type, required, weight }: any) => (
  <div className="flex gap-1">
    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
      {type === "multiple" ? "MCQ" : "Essay"}
    </Badge>
    {required && <Badge className="bg-red-50 text-red-600 text-[9px] px-1.5 py-0 h-4 border-0">Req</Badge>}
    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">W:{weight}</Badge>
  </div>
);

const MCQQuestion = ({ q, idx, value, onChange }: any) => {
  const text = q.translations.en?.text || "";
  return (
    <div className="border-l-2 border-gray-200 pl-3 py-2 hover:border-indigo-400 transition-colors">
      <div className="flex gap-2">
        <div className="h-5 w-5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-1.5">
          <QuestionMeta type={q.type} required={q.required} weight={q.weight} />
          <p className="text-sm font-medium">{text}</p>
          {q.translations.en?.description && (
            <p className="text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded">{q.translations.en.description}</p>
          )}
          <RadioGroup value={value} onValueChange={onChange} className="space-y-1">
            {q.choices?.map((c: any) => (
              <div key={c.id} className={cn("flex items-center gap-2 p-1.5 rounded cursor-pointer", value === c.id && "bg-indigo-50")}>
                <RadioGroupItem value={c.id} id={c.id} className="h-3 w-3" />
                <Label htmlFor={c.id} className="text-xs cursor-pointer">{c.translations.en || c.value}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

const EssayQuestion = ({ q, idx, value, onChange }: any) => {
  const text = q.translations.en?.text || "";
  return (
    <div className="border-l-2 border-gray-200 pl-3 py-2 hover:border-emerald-400 transition-colors">
      <div className="flex gap-2">
        <div className="h-5 w-5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-1.5">
          <QuestionMeta type={q.type} required={q.required} weight={q.weight} />
          <p className="text-sm font-medium">{text}</p>
          {q.translations.en?.description && (
            <p className="text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded">{q.translations.en.description}</p>
          )}
          <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Your answer..." className="min-h-[80px] text-sm" />
        </div>
      </div>
    </div>
  );
};

// ============== MAIN COMPONENT ==============
export default function TemplatePreview() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"all" | "mcq" | "essay">("all");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const id = (await params).id;
        const res = await fetch(`${API_BASE_URL}/api/templates/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        const questions = (data.questions || data.content?.questions || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setTemplate({ ...data, questions });
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params, toast]);

  const getText = useCallback((obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj.en || obj.am || "";
  }, []);

  const total = template?.questions?.length || 0;
  const mcqCount = template?.questions?.filter(q => q.type === "multiple").length || 0;
  const essayCount = template?.questions?.filter(q => q.type === "paragraph").length || 0;
  const answered = Object.values(answers).filter(a => a?.trim()).length;
  const requiredTotal = template?.questions?.filter(q => q.required).length || 0;
  const requiredAnswered = template?.questions?.filter(q => q.required && answers[q.id]?.trim()).length || 0;

  const filtered = template?.questions?.filter(q => {
    if (activeTab === "mcq") return q.type === "multiple";
    if (activeTab === "essay") return q.type === "paragraph";
    return true;
  }) || [];

  const handleAnswer = (id: string, val: string) => setAnswers(prev => ({ ...prev, [id]: val }));
  const handleSubmit = () => toast({ title: "Preview Mode", description: "Submit disabled in preview" });

  if (loading) return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto p-4"><Skeleton className="h-[500px] rounded-xl" /></div>
    </AdminDashboardLayout>
  );

  if (!template) return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Template not found</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    </AdminDashboardLayout>
  );

  return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto p-3 space-y-3 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 h-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <Badge className="bg-amber-100 text-amber-700 text-[10px] gap-1">
            <Eye className="h-2.5 w-2.5" /> Preview Mode
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-bold text-white">{getText(template.name) || "Untitled"}</h1>
                <div className="flex gap-1 mt-1">
                  {template.academicYear && <Badge className="bg-white/20 text-white text-[9px]">{template.academicYear}</Badge>}
                  {template.semester && <Badge className="bg-white/20 text-white text-[9px]">{template.semester}</Badge>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{total}</div>
                <div className="text-[8px] text-white/70">Questions</div>
              </div>
            </div>
          </div>

          {/* Intro */}
          {(getText(template.intro) || getText(template.why)) && (
            <div className="border-b bg-gray-50 px-4 py-2 space-y-1">
              {getText(template.intro) && <p className="text-xs text-gray-600 flex gap-1"><FileText className="h-3 w-3 shrink-0" />{getText(template.intro)}</p>}
              {getText(template.why) && <p className="text-xs text-gray-600 flex gap-1"><HelpCircle className="h-3 w-3 shrink-0" />{getText(template.why)}</p>}
            </div>
          )}

          {/* Progress Bar */}
          {requiredTotal > 0 && (
            <div className="px-4 pt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />Required</span>
                <span>{requiredAnswered}/{requiredTotal}</span>
              </div>
              <Progress value={(requiredAnswered / requiredTotal) * 100} className="h-1.5" />
            </div>
          )}

          {/* Tabs */}
          <div className="px-4 pt-3">
            <div className="flex gap-3 border-b">
              {[
                { id: "all", label: "All", count: total },
                { id: "mcq", label: "MCQ", count: mcqCount },
                { id: "essay", label: "Essay", count: essayCount },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn("pb-1.5 text-xs font-medium transition-colors", activeTab === tab.id ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500")}
                >
                  {tab.label} <Badge variant="secondary" className="ml-1 text-[9px] px-1">{tab.count}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="p-4 space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">No questions</p>
            ) : (
              filtered.map((q, i) => 
                q.type === "multiple" 
                  ? <MCQQuestion key={q.id} q={q} idx={i} value={answers[q.id] || ""} onChange={(v: string) => handleAnswer(q.id, v)} />
                  : <EssayQuestion key={q.id} q={q} idx={i} value={answers[q.id] || ""} onChange={(v: string) => handleAnswer(q.id, v)} />
              )
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <BookOpen className="h-3 w-3" />
              {answered}/{total} answered
            </div>
            <Button onClick={handleSubmit} size="sm" className="gap-1 h-7 text-xs bg-indigo-600">
              <Send className="h-3 w-3" /> Submit
            </Button>
          </div>
        </Card>

        {/* Notice */}
        <p className="text-center text-[10px] text-gray-400 flex justify-center gap-1">
          <Eye className="h-3 w-3" /> Preview Mode - Submit disabled
        </p>
      </div>
    </AdminDashboardLayout>
  );
}