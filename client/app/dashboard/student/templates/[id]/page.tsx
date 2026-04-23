"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, CheckCircle2, AlertCircle, BookOpen, Target,
  Clock, Calendar, FileQuestion, Send, Save, Eye,
  HelpCircle, Award, Sparkles, Timer, Star, Flame, Zap, User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdminDashboardLayout } from "@/components/dashboard/student/layout/adminLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  createdAt?: string;
  deadline?: string;
}

// ============== COUNTDOWN HOOK ==============
const useCountdown = (deadline: string | undefined, onExpire?: () => void) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!deadline) return;
    const calculate = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        onExpire?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    };
    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  return timeLeft;
};

// ============== COMPACT COMPONENTS ==============
const CountdownBadge = ({ deadline, onExpire }: any) => {
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline, onExpire);
  if (expired) return <Badge className="bg-red-100 text-red-600 gap-1"><AlertCircle className="h-3 w-3" />Closed</Badge>;
  return (
    <Badge className="bg-amber-100 text-amber-700 gap-1.5 px-2 py-1">
      <Timer className="h-3 w-3" />
      {days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`}
    </Badge>
  );
};

const InfoRow = ({ icon: Icon, text, color }: any) => text && (
  <div className="flex gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
    <Icon className={`h-4 w-4 ${color} shrink-0 mt-0.5`} />
    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
  </div>
);

const QuestionMeta = ({ type, required, weight }: any) => (
  <div className="flex gap-1 flex-wrap">
    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{type === "multiple" ? "MCQ" : "Essay"}</Badge>
    {required && <Badge className="bg-red-50 text-red-600 text-[10px] px-1.5 py-0 h-4 border-0">Req</Badge>}
    {weight > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{weight}pts</Badge>}
  </div>
);

const MCQOption = ({ choice, idx, selected, onSelect, disabled }: any) => (
  <div className={cn(
    "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
    selected === choice.id
      ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-sm"
      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm",
    disabled && "opacity-50 cursor-not-allowed"
  )} onClick={() => !disabled && onSelect(choice.id)}>
    <RadioGroupItem value={choice.id} id={choice.id} className="h-4 w-4" disabled={disabled} />
    <Label htmlFor={choice.id} className={cn("text-sm cursor-pointer flex-1 font-medium", disabled && "cursor-not-allowed")}>
      <span className="inline-flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
          {String.fromCharCode(65 + idx)}
        </span>
        {choice.translations.en || choice.value}
      </span>
    </Label>
    {selected === choice.id && <CheckCircle2 className="h-4 w-4 text-indigo-500" />}
  </div>
);

const MCQQuestion = ({ q, idx, value, onChange, disabled }: any) => {
  const text = q.translations.en?.text || "";
  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200",
      !disabled && "hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800"
    )}>
      <div className="flex gap-4">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <QuestionMeta type={q.type} required={q.required} weight={q.weight} />
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{text}</p>
          {q.translations.en?.description && (
            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
                <span className="mt-0.5">💡</span>
                {q.translations.en.description}
              </p>
            </div>
          )}
          <RadioGroup value={value} onValueChange={onChange} className="space-y-2 mt-2" disabled={disabled}>
            {q.choices?.map((c: any, i: number) => <MCQOption key={c.id} choice={c} idx={i} selected={value} onSelect={onChange} disabled={disabled} />)}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

const EssayQuestion = ({ q, idx, value, onChange, disabled }: any) => {
  const text = q.translations.en?.text || "";
  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200",
      !disabled && "hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800"
    )}>
      <div className="flex gap-4">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <QuestionMeta type={q.type} required={q.required} weight={q.weight} />
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{text}</p>
          {q.translations.en?.description && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                <span className="mt-0.5">💡</span>
                {q.translations.en.description}
              </p>
            </div>
          )}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="text-sm min-h-[120px] resize-none bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
            disabled={disabled}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Minimum {q.required ? 'required' : 'optional'}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{value.length} characters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== MAIN COMPONENT ==============
export default function StudentTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expired, setExpired] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{ year: string; section: string } | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedTeacherIds, setSubmittedTeacherIds] = useState<Set<number>>(new Set());

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const id = (await params).id;
        const token = localStorage.getItem('jwtToken');

        const [templateRes, responseRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/templates/${id}`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/responses?templateId=${id}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!templateRes.ok) throw new Error("Not found");
        const data = await templateRes.json();
        const questions = (data.questions || data.content?.questions || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setTemplate({ ...data, questions });
        setAnswers(JSON.parse(localStorage.getItem(`template_${id}_answers`) || "{}"));

        // Check if student has already submitted to any teacher
        if (responseRes.ok) {
          const responses = await responseRes.json();
          if (responses.length > 0) {
            // Track which teachers have been submitted to
            const submittedIds = new Set<number>();
            responses.forEach((r: any) => {
              if (r.teacherId) {
                submittedIds.add(r.teacherId);
              }
            });
            setSubmittedTeacherIds(submittedIds);

            // If all teachers have been submitted to, mark as fully completed
            setHasSubmitted(submittedIds.size > 0);

            // Load the most recent submitted answers
            const mostRecent = responses[responses.length - 1];
            const submittedAnswers = mostRecent.answers;
            if (submittedAnswers) {
              const answersMap: Record<string, string> = {};
              submittedAnswers.forEach((a: any) => {
                answersMap[a.questionId] = a.answer;
              });
              setAnswers(answersMap);
            }
          }
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to load template", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params, toast]);

  // Fetch student info and teachers
  useEffect(() => {
    const fetchStudentAndTeachers = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Fetch current student info
        const studentRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (studentRes.ok) {
          const studentData = await studentRes.json();
          console.log("Student data:", studentData);
          // section is an array, use the first section
          const section = Array.isArray(studentData.section) ? studentData.section[0] : studentData.section;
          console.log("Using section:", section);

          if (studentData.year && section) {
            setStudentInfo({ year: studentData.year, section });

            // Fetch teachers based on year and section
            const teachersRes = await fetch(`${API_BASE_URL}/api/students/teachers?year=${studentData.year}&section=${section}`, {
              credentials: "include",
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (teachersRes.ok) {
              const teachersData = await teachersRes.json();
              console.log("Teachers data:", teachersData);
              setTeachers(teachersData);
            } else {
              console.error("Failed to fetch teachers:", teachersRes.status);
            }
          } else {
            console.log("No year or section found in student data");
          }
        } else {
          console.error("Failed to fetch student info:", studentRes.status);
        }
      } catch (error) {
        console.error("Error fetching student info or teachers:", error);
      }
    };

    fetchStudentAndTeachers();
  }, []);

  // Auto-save
  useEffect(() => {
    if (template?.id && Object.keys(answers).length && !expired) {
      const timer = setTimeout(() => {
        localStorage.setItem(`template_${template.id}_answers`, JSON.stringify(answers));
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [answers, template?.id, expired]);

  // Computed values
  const getText = useCallback((obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj.en || "";
  }, []);

  const total = template?.questions?.length || 0;
  const answered = Object.values(answers).filter(a => typeof a === 'string' && a.trim()).length;
  const requiredTotal = template?.questions?.filter(q => q.required).length || 0;
  const requiredAnswered = template?.questions?.filter(q => q.required && typeof answers[q.id] === 'string' && answers[q.id].trim()).length || 0;
  const totalPoints = template?.questions?.reduce((s, q) => s + (q.weight || 0), 0) || 0;
  const earnedPoints = template?.questions?.reduce((s, q) => s + (typeof answers[q.id] === 'string' && answers[q.id].trim() ? (q.weight || 0) : 0), 0) || 0;
  const progress = requiredTotal > 0 ? (requiredAnswered / requiredTotal) * 100 : 0;

  const hasIntro = getText(template?.intro);
  const hasWhy = getText(template?.why);

  // Handlers
  const handleAnswer = (id: string, val: string) => {
    if (submittedTeacherIds.size === teachers.length && teachers.length > 0) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };
  const handleSave = () => {
    if (template?.id) localStorage.setItem(`template_${template.id}_answers`, JSON.stringify(answers));
    toast({ title: "💾 Draft Saved", description: "Your progress has been saved" });
  };
  const handleSubmit = async () => {
    if (expired) return toast({ title: "Closed", description: "Deadline passed", variant: "destructive" });

    if (!selectedTeacherId) {
      return toast({ title: "Teacher Required", description: "Please select a teacher before submitting", variant: "destructive" });
    }

    // Check if already submitted to this teacher
    if (submittedTeacherIds.has(Number(selectedTeacherId))) {
      return toast({ title: "Already Submitted", description: "You have already submitted to this teacher", variant: "destructive" });
    }

    const unanswered = template?.questions?.filter(q => q.required && (typeof answers[q.id] !== 'string' || !answers[q.id].trim())) || [];
    if (unanswered.length) return toast({ title: "Incomplete", description: `Answer ${unanswered.length} more required question(s)`, variant: "destructive" });

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          templateId: template?.id,
          teacherId: selectedTeacherId,
          answers: Object.entries(answers).map(([id, answer]) => ({ questionId: id, answer, type: "text" })),
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      localStorage.removeItem(`template_${template?.id}_answers`);

      // Add teacher to submitted set
      setSubmittedTeacherIds(prev => new Set(prev).add(Number(selectedTeacherId)));

      // Clear selected teacher
      setSelectedTeacherId("");

      // Check if all teachers are now submitted
      if (submittedTeacherIds.size + 1 === teachers.length) {
        setHasSubmitted(true);
        toast({ title: "🎉 All Completed!", description: "You have submitted to all teachers" });
      } else {
        toast({ title: "🎉 Submitted!", description: "Your response has been recorded. Select another teacher to continue." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Submission failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto p-3"><Skeleton className="h-[500px] rounded-xl" /></div>
    </AdminDashboardLayout>
  );

  if (!template) return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">Template not found</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    </AdminDashboardLayout>
  );

  return (
    <AdminDashboardLayout>
      <TooltipProvider>
        <div className="max-w-3xl mx-auto p-3 space-y-3 pb-28 bg-gray-50 dark:bg-slate-900 min-h-screen">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 h-8 text-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
            <div className="flex gap-2">
              {template.deadline && <CountdownBadge deadline={template.deadline} onExpire={() => setExpired(true)} />}
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3 w-3 text-white/80" />
                    <span className="text-[9px] font-semibold text-white/80 uppercase">{template.status === "active" ? "Active" : "Draft"}</span>
                    {totalPoints > 0 && <Badge className="bg-white/20 text-white text-[9px] gap-1"><Star className="h-2.5 w-2.5" />{totalPoints}pts</Badge>}
                  </div>
                  <h1 className="text-xl font-bold text-white">{getText(template.name) || "Untitled"}</h1>
                  <div className="flex gap-1.5 mt-2">
                    {template.academicYear && <Badge className="bg-white/20 text-white text-[9px]">{template.academicYear}</Badge>}
                    {template.semester && <Badge className="bg-white/20 text-white text-[9px]">{template.semester}</Badge>}
                    <Badge className="bg-white/20 text-white text-[9px]">{total} Qs</Badge>
                  </div>
                </div>
                {template.createdAt && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-white/90">{new Date(template.createdAt).toLocaleDateString()}</div>
                    <div className="text-[8px] text-white/60">Created</div>
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="border-b bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-slate-800 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Teacher Selection</span>
                    {studentInfo && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {studentInfo.year} • {studentInfo.section}
                      </p>
                    )}
                  </div>
                </div>
                {submittedTeacherIds.size > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                      {submittedTeacherIds.size}/{teachers.length}
                    </span>
                  </div>
                )}
              </div>

              {submittedTeacherIds.size === teachers.length && teachers.length > 0 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">All Assessments Completed</p>
                      <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">You have successfully submitted to all teachers</p>
                    </div>
                  </div>
                </div>
              ) : teachers.length > 0 ? (
                <div className="space-y-2">
                  <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId} disabled={submittedTeacherIds.size === teachers.length}>
                    <SelectTrigger className="h-11 text-sm bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Select a teacher to submit to" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                      {teachers.map((teacher) => {
                        const isSubmitted = submittedTeacherIds.has(teacher.id);
                        return (
                          <SelectItem
                            key={teacher.id}
                            value={String(teacher.id)}
                            disabled={isSubmitted}
                            className="focus:bg-indigo-50 dark:focus:bg-indigo-950/30"
                          >
                            <div className="flex items-center justify-between w-full pr-2">
                              <div className="flex items-center gap-2">
                                {isSubmitted ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                                )}
                                <span className={isSubmitted ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}>
                                  {teacher.title ? `${teacher.title} ` : ""}{teacher.name}
                                </span>
                              </div>
                              {isSubmitted && (
                                <Badge variant="secondary" className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  Done
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {submittedTeacherIds.size > 0 && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-500" />
                      Continue selecting teachers to complete all assessments
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">No Teachers Available</p>
                      {studentInfo ? (
                        <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">
                          No teachers found for {studentInfo.year} - {studentInfo.section}
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">
                          Loading section information...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Intro & Purpose - Apple/Shein Style */}
            {(hasIntro || hasWhy) && (
              <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 px-4 py-3 space-y-2">
                {hasIntro && <InfoRow icon={Target} text={hasIntro} color="text-purple-500" />}
                {hasWhy && <InfoRow icon={HelpCircle} text={hasWhy} color="text-pink-500" />}
              </div>
            )}

            {/* Auto-save indicator */}
            {saved && (
              <div className="px-4 py-2">
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />Auto-saved
                </p>
              </div>
            )}

            {/* Questions List */}
            <div className="p-4 space-y-3 bg-gray-50 dark:bg-slate-900/50">
              {template?.questions?.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No questions available</p>
                </div>
              ) : (
                template?.questions?.map((q: any, i: number) =>
                  q.type === "multiple"
                    ? <MCQQuestion key={q.id} q={q} idx={i} value={answers[q.id] || ""} onChange={(v: string) => handleAnswer(q.id, v)} disabled={submittedTeacherIds.size === teachers.length && teachers.length > 0} />
                    : <EssayQuestion key={q.id} q={q} idx={i} value={answers[q.id] || ""} onChange={(v: string) => handleAnswer(q.id, v)} disabled={submittedTeacherIds.size === teachers.length && teachers.length > 0} />
                )
              )}
            </div>
          </Card>

          {/* Fixed Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="max-w-3xl mx-auto p-4">
              {submittedTeacherIds.size === teachers.length && teachers.length > 0 ? (
                <div className="flex items-center justify-center gap-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">All Assessments Completed</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {submittedTeacherIds.size > 0 && submittedTeacherIds.size < teachers.length && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {submittedTeacherIds.size} of {teachers.length} teachers completed
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={expired}
                      className="flex-1 h-11 gap-2 text-sm font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <Save className="h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || expired || !selectedTeacherId}
                      className="flex-1 h-11 gap-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                    >
                      {submitting ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Submit
                    </Button>
                  </div>
                </div>
              )}
              {expired && (
                <div className="flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">Submission deadline has passed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </AdminDashboardLayout>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");