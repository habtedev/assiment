"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  BookOpen,
  Award,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Star,
  Filter,
  Search,
  Grid3x3,
  List,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
  RefreshCw,
  ExternalLink,
  Briefcase,
  GraduationCap,
  ClipboardList,
  Sparkles,
  Timer,
  Zap,
  Flame,
  Shield,
  Crown,
  Gem,
  Rocket,
  ThumbsUp,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Types
interface DatabaseTemplate {
  id: string;
  name: Record<string, string>;
  title?: string;
  description?: string;
  intro?: Record<string, string>;
  why?: Record<string, string>;
  academicYear?: string;
  semester?: string;
  questions: any[];
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "active" | "archived" | "inactive";
  questionCount?: number;
  deadline?: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  type: "assessment" | "course" | "grade" | "project";
  status: "active" | "completed" | "pending" | "draft" | "archived";
  progress: number;
  dueDate?: string;
  startDate?: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  estimatedTime?: string;
  instructor?: string;
  rating?: number;
  submissions?: number;
  tags?: string[];
  questionCount?: number;
  academicYear?: string;
  semester?: string;
  deadline?: string;
}

// Countdown Component
const CountdownTimer = ({ deadline, compact = false }: { deadline: string; compact?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(deadline).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (86400000)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (3600000)) / (1000 * 60)),
      seconds: Math.floor((difference % (60000)) / 1000),
      expired: false,
    };
  }, [deadline]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/30">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <span className="text-xs font-medium text-red-600 dark:text-red-400">Expired</span>
      </div>
    );
  }

  if (compact) {
    if (timeLeft.days > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30">
          <Flame className="h-3 w-3 text-amber-500" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{timeLeft.days}d left</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30">
        <Zap className="h-3 w-3 text-rose-500" />
        <span className="text-xs font-bold text-rose-700 dark:text-rose-400">{timeLeft.hours}h {timeLeft.minutes}m</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-xl p-2">
      <Timer className="h-4 w-4 text-amber-600" />
      <div className="flex gap-1.5">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold text-amber-700">{timeLeft.days}</div>
            <div className="text-[9px] text-gray-500">Days</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-lg font-bold text-amber-700">{timeLeft.hours}</div>
          <div className="text-[9px] text-gray-500">Hrs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-amber-700">{timeLeft.minutes}</div>
          <div className="text-[9px] text-gray-500">Min</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-amber-700">{timeLeft.seconds}</div>
          <div className="text-[9px] text-gray-500">Sec</div>
        </div>
      </div>
    </div>
  );
};

// Badge Components
const TypeBadge = ({ type }: { type: string }) => {
  const types = {
    assessment: { label: "Assessment", icon: ClipboardList, color: "from-blue-500 to-indigo-500" },
    course: { label: "Course", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
    grade: { label: "Grade", icon: Award, color: "from-green-500 to-emerald-500" },
    project: { label: "Project", icon: Briefcase, color: "from-orange-500 to-red-500" },
  };
  const config = types[type as keyof typeof types] || types.assessment;
  const Icon = config.icon;
  return (
    <Badge className={cn("bg-gradient-to-r text-white border-0 px-2 py-0.5 text-[10px]", config.color)}>
      <Icon className="h-2.5 w-2.5 mr-1" />
      {config.label}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statuses = {
    active: { label: "Open", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400", icon: Sparkles },
    completed: { label: "Done", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400", icon: CheckCircle2 },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400", icon: Clock },
    draft: { label: "Draft", color: "bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400", icon: FileText },
  };
  const config = statuses[status as keyof typeof statuses] || statuses.active;
  const Icon = config.icon;
  return (
    <Badge className={cn("border-0 text-[10px] px-1.5 py-0.5 gap-1", config.color)}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </Badge>
  );
};

// Main Component
export const TemplateList: React.FC = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, trending: 0 });

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  const isExpired = (deadline: string | undefined) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getGradient = (type: string): string => {
    const gradients = {
      assessment: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
      course: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      grade: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      project: "from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20",
    };
    return gradients[type as keyof typeof gradients] || gradients.assessment;
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/templates`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: DatabaseTemplate[] = await res.json();

      const activeTemplates = data.filter(dbTemplate => 
        dbTemplate.status === "active" && 
        (!dbTemplate.deadline || !isExpired(dbTemplate.deadline))
      );

      const mappedTemplates = activeTemplates.map((dbTemplate, idx) => {
        const questionCount = dbTemplate.questionCount || dbTemplate.questions?.length || 0;
        const type = "assessment" as const;
        const description = typeof dbTemplate.description === "string"
          ? dbTemplate.description
          : (dbTemplate.description as any)?.en || "No description available";
        return {
          id: dbTemplate.id,
          title: dbTemplate.name?.en || dbTemplate.title || "Untitled Template",
          description,
          type,
          status: "active" as const,
          progress: 0,
          dueDate: dbTemplate.deadline,
          icon: ClipboardList,
          color: "from-indigo-500 to-blue-500",
          gradient: getGradient(type),
          estimatedTime: `${Math.ceil(questionCount * 1.5)} min`,
          questionCount,
          academicYear: dbTemplate.academicYear,
          semester: dbTemplate.semester,
          deadline: dbTemplate.deadline,
          tags: [dbTemplate.semester, dbTemplate.academicYear].filter((t): t is string => Boolean(t)),
          rating: 4 + (idx % 5) * 0.2,
          submissions: Math.floor(Math.random() * 500) + 50,
        };
      });

      setTemplates(mappedTemplates);
      setStats({
        total: mappedTemplates.length,
        active: mappedTemplates.length,
        completed: 0,
        trending: Math.floor(Math.random() * 50) + 20,
      });
    } catch (err) {
      setError("Failed to load templates");
      toast({ title: "Error", description: "Failed to load templates", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || template.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [templates, searchQuery, filterType]);

  const handleTemplateClick = (templateId: string) => {
    window.location.href = `/dashboard/student/templates/${templateId}`;
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 pb-20">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  My Templates
                </h1>
                <p className="text-[11px] text-gray-500 mt-0.5">{stats.total} active assessments</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setFilterType("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  filterType === "all" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 px-4 py-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3 text-white">
            <ClipboardList className="h-5 w-5 mb-2 opacity-80" />
            <div className="text-xl font-bold">{stats.total}</div>
            <div className="text-[10px] opacity-80">Total</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 text-white">
            <Sparkles className="h-5 w-5 mb-2 opacity-80" />
            <div className="text-xl font-bold">{stats.active}</div>
            <div className="text-[10px] opacity-80">Active</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3 text-white">
            <TrendingUp className="h-5 w-5 mb-2 opacity-80" />
            <div className="text-xl font-bold">{stats.trending}</div>
            <div className="text-[10px] opacity-80">Trending</div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="px-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No templates found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-3"
            )}>
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateClick(template.id)}
                  className="cursor-pointer"
                >
                  <Card className={cn(
                    "group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300",
                    viewMode === "list" && "flex",
                    template.gradient
                  )}>
                    {/* Top Gradient Bar */}
                    <div className={cn("h-1 bg-gradient-to-r", template.color)} />
                    
                    <CardContent className={cn("p-4", viewMode === "list" && "flex-1")}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={cn("p-2 rounded-xl bg-gradient-to-br shrink-0", template.color)}>
                            <template.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white">
                              {template.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <TypeBadge type={template.type} />
                              <StatusBadge status={template.status} />
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0 ml-2" />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {template.description}
                      </p>

                      {/* Metadata Row */}
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {template.questionCount} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {template.estimatedTime}
                          </span>
                        </div>
                        {template.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{template.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {template.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 border-gray-200 dark:border-gray-700">
                              {tag}
                            </Badge>
                          ))}
                          {template.submissions && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-1">
                              <Users className="h-2 w-2" />
                              {template.submissions.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Countdown Timer */}
                      {template.deadline && (
                        <div className="mt-2">
                          <CountdownTimer deadline={template.deadline} compact />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-20 right-4 z-30">
          <Button 
            onClick={fetchTemplates}
            className="h-12 w-12 rounded-full shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TemplateList;