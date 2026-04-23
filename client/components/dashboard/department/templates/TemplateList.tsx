"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MoreVertical,
  FileQuestion,
  BookOpen,
  Users,
  Layout,
  AlertCircle,
  Timer,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Star,
} from "lucide-react";

/* ---------------------------------------------
   UTIL & CONSTANTS
----------------------------------------------*/
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Gradient mapping for card headers
const GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-purple-500 to-fuchsia-500",
];

/* ---------------------------------------------
   COUNTDOWN COMPONENT - Premium Version
----------------------------------------------*/
function Countdown({ deadline, compact = false }: { deadline: string; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState("");

  const calculate = useCallback(() => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (compact) {
      if (d > 0) return `${d}d ${h}h`;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m ${s}s`;
    }

    return `${d}d ${h}h ${m}m ${s}s`;
  }, [deadline, compact]);

  useEffect(() => {
    setTimeLeft(calculate());

    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculate]);

  const expired = timeLeft === "Expired";

  if (expired) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 backdrop-blur-sm">
        <Timer className="h-3 w-3" />
        Expired
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 px-3 py-1 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-500/30">
      <Zap className="h-3 w-3" />
      {timeLeft}
    </div>
  );
}

/* ---------------------------------------------
   STAT CARD COMPONENT
----------------------------------------------*/
function StatCard({ label, value, icon: Icon, trend, color }: { label: string; value: string | number; icon: React.ElementType; trend?: string; color: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-5 transition-all hover:shadow-xl hover:scale-[1.02]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-800/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className={cn("inline-flex rounded-xl p-2.5 mb-3", color)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {label}
          </p>
          {trend && (
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        
        <p className="mt-2 text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   MAIN COMPONENT
----------------------------------------------*/
export default function TemplateDashboard() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [dayCount, setDayCount] = useState("1");
  const [timeValue, setTimeValue] = useState("23:59");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  /* ---------------------------------------------
     FETCH REAL DATA
  ----------------------------------------------*/
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/templates`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setTemplates(data || []);
    } catch (error) {
      console.error(error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     MEMO DATA
  ----------------------------------------------*/
  const isExpired = (template: any) => {
    if (!template.deadline) return false;
    return new Date(template.deadline) < new Date();
  };

  const templatesWithDeadlines = useMemo(
    () => templates.filter((t) => t.deadline && !isExpired(t)),
    [templates]
  );

  const filteredTemplates = useMemo(() => {
    if (statusFilter === "all") return templates;
    if (statusFilter === "active") return templates.filter((t) => t.status === "active" && !isExpired(t));
    if (statusFilter === "inactive") return templates.filter((t) => t.status === "inactive" || t.status === "draft" || isExpired(t));
    return templates;
  }, [templates, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: templates.length,
      active: templates.filter((t) => t.status === "active" && !isExpired(t)).length,
      draft: templates.filter((t) => t.status === "draft" || t.status === "inactive" || isExpired(t)).length,
      responses: templates.reduce(
        (sum, t) => sum + Number(t.responses || 0),
        0
      ),
      completionRate: templates.length > 0
        ? Math.round((templates.filter(t => t.status === "active" && !isExpired(t)).length / templates.length) * 100)
        : 0,
    };
  }, [templates]);

  /* ---------------------------------------------
     HELPERS
  ----------------------------------------------*/
  const formatTitle = (template: any) => {
    if (typeof template.title === "string" && template.title.trim()) return template.title;
    if (typeof template.name === "string" && template.name.trim()) return template.name;
    return "Untitled Template";
  };

  const formatDescription = (template: any) => {
    if (typeof template.description === "string" && template.description.trim())
      return template.description;
    return "No description available";
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getProgress = (template: any) => {
    if (!template.deadline || !template.createdAt) return 0;
    const start = new Date(template.createdAt).getTime();
    const end = new Date(template.deadline).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getTemplateStatus = (template: any) => {
    if (template.status === "draft" || template.status === "inactive") return "Draft";
    if (isExpired(template)) return "Expired";
    return "Active";
  };

  /* ---------------------------------------------
     OPEN DIALOG
  ----------------------------------------------*/
  const handleOpenDialog = (template: any) => {
    setSelectedTemplate(template);
    if (template.deadline) {
      const d = new Date(template.deadline);
      const diffDays = Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
      setDayCount(String(diffDays));
      setTimeValue(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    } else {
      setDayCount("1");
      setTimeValue("23:59");
    }
    setIsDialogOpen(true);
  };

  const handleViewTemplate = (templateId: string | number) => {
    router.push(`/dashboard/department/templates/${templateId}`);
  };

  /* ---------------------------------------------
     SAVE DEADLINE REAL API
  ----------------------------------------------*/
  const handleSaveDeadline = async () => {
    if (!selectedTemplate) return;

    const newDeadline = new Date();
    newDeadline.setDate(newDeadline.getDate() + Number(dayCount));

    const [h, m] = timeValue.split(":");
    newDeadline.setHours(Number(h), Number(m), 0, 0);

    const deadlineISO = newDeadline.toISOString();

    try {
      const res = await fetch(`${API_BASE_URL}/api/templates/${selectedTemplate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          deadline: deadlineISO,
          status: "active"
        }),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "Update failed");

      setTemplates((prev) =>
        prev.map((item: any) =>
          item.id === selectedTemplate.id
            ? { ...item, deadline: deadlineISO, status: "active" }
            : item
        )
      );

      setIsDialogOpen(false);
      alert("Deadline updated and template is now active!");
    } catch (error) {
      console.error("Error updating deadline:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to update deadline: ${errorMessage}`);
    }
  };

  /* ---------------------------------------------
     LOADING
  ----------------------------------------------*/
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-2xl border-4 border-gray-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-500 animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Loading templates
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     UI - Premium E-commerce Style
  ----------------------------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  ASSESSMENT HUB
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Templates
              </h1>
              <p className="text-indigo-100 mt-2 text-base">
                Manage your assessment templates and deadlines efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-2xl font-bold text-white">{templates.length}</div>
                <div className="text-xs text-indigo-200">Total Templates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-2xl font-bold text-white">{stats.active}</div>
                <div className="text-xs text-indigo-200">Active</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8 -mt-8">
        {/* STATS SECTION - Premium Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard 
            label="Total Templates" 
            value={stats.total} 
            icon={Layout}
            color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
          />
          <StatCard 
            label="Active" 
            value={stats.active} 
            icon={Zap}
            trend="+12%"
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          />
          <StatCard 
            label="Draft" 
            value={stats.draft} 
            icon={FileQuestion}
            color="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
          />
          <StatCard 
            label="Total Responses" 
            value={stats.responses} 
            icon={Users}
            trend="+8%"
            color="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
          />
          <StatCard 
            label="Completion Rate" 
            value={`${stats.completionRate}%`} 
            icon={TrendingUp}
            color="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          />
        </div>

        {/* ACTIVE DEADLINES SECTION */}
        {templatesWithDeadlines.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Active Deadlines
                  </h3>
                  <p className="text-xs text-gray-400">{templatesWithDeadlines.length} templates expiring soon</p>
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mx-4" />
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templatesWithDeadlines.slice(0, 3).map((template, idx) => (
                <div
                  key={template.id}
                  className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatTitle(template)}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{formatDate(template.deadline)}</p>
                      </div>
                    </div>
                    <Countdown deadline={template.deadline} compact />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      <Users className="h-2.5 w-2.5" />
                      {template.targetAudience || "Student"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATES GRID - Premium Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                All Templates
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Browse and manage your assessment templates
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
              <Award className="h-3 w-3" />
              {filteredTemplates.length} Available
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "active"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "inactive"
                  ? "bg-gray-600 text-white shadow-lg shadow-gray-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              Draft
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template, idx) => {
              const progress = getProgress(template);
              const gradientIndex = idx % GRADIENTS.length;
              
              return (
                <div
                  key={template.id}
                  className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  {/* Gradient Top Bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${GRADIENTS[gradientIndex]}`} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl transition-all",
                          getTemplateStatus(template) === "Active"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : getTemplateStatus(template) === "Expired"
                            ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        )}
                      >
                        {getTemplateStatus(template) === "Expired" ? (
                          <Timer className="h-4 w-4" />
                        ) : (
                          <FileQuestion className="h-4 w-4" />
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(template);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                        {formatTitle(template)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {formatDescription(template)}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <Calendar className="h-3 w-3" />
                        {template.academicYear || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="h-3 w-3" />
                        {template.semester || "General"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 dark:bg-purple-950/30 px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                        <Users className="h-3 w-3" />
                        {template.targetAudience || "Student"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {template.deadline && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Deadline</span>
                          <span className={cn(
                            "font-semibold",
                            isExpired(template) ? "text-red-500" : progress > 80 ? "text-red-500" : "text-indigo-600 dark:text-indigo-400"
                          )}>
                            {isExpired(template) ? "Expired" : `${Math.round(progress)}%`}
                          </span>
                        </div>
                        <div className="relative h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "absolute h-full rounded-full transition-all duration-500",
                              isExpired(template)
                                ? "bg-red-500"
                                : progress > 80
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500"
                            )}
                            style={{ width: isExpired(template) ? "100%" : `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(template.deadline)}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-5 py-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-medium">{template.responses || 0}</span>
                        <span className="text-xs text-gray-400">responses</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(template);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors group"
                    >
                      {isExpired(template) ? "Extend Deadline" : template.deadline ? "Manage Deadline" : "Set Deadline"}
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <FileQuestion className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No templates yet
            </h3>
            <p className="text-sm text-gray-500">Get started by creating your first template</p>
          </div>
        )}
      </div>

      {/* DIALOG - Premium Modal */}
      {isDialogOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
          />
          
          <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {/* Dialog Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Set Deadline</h2>
                <p className="text-indigo-100 text-xs mt-0.5">
                  {formatTitle(selectedTemplate)}
                </p>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Days from today
                  </label>
                  <select
                    value={dayCount}
                    onChange={(e) => setDayCount(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {[0, 1, 2, 3, 5, 7, 14, 30].map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "Today" : `${n} Day${n > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Closing time
                  </label>
                  <input
                    type="time"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 flex gap-2.5 border border-indigo-100 dark:border-indigo-800/50">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                    Participants will be notified automatically about the deadline change.
                  </p>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDeadline}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}