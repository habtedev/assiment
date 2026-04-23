"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Clock, Timer, Calendar, ChevronRight, X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// ============== TYPES ==============
interface Template {
  id: number;
  title: string;
  name?: string;
  deadline: string;
  status: string;
  academicYear?: string;
  semester?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

// ============== CONSTANTS ==============
const COUNTDOWN_UPDATE_INTERVAL = 1000;
const DEFAULT_DEADLINE_DAYS = 30;

// ============== UTILITY FUNCTIONS ==============
const calculateTimeLeft = (deadlineDate: Date): TimeLeft => {
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
};

const formatTimeLeft = (timeLeft: TimeLeft): string => {
  if (timeLeft.expired) return "Expired";
  const { days, hours, minutes, seconds } = timeLeft;
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
};

const formatTitle = (template: Template): string => {
  const title = template.title || template.name;
  return title?.trim() ? title : "Untitled Template";
};

const formatDate = (iso: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const calculateProgress = (deadlineDate: Date): number => {
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff <= 0) return 100;
  
  // Calculate total duration (assuming 30 days from creation or fallback)
  const startDate = new Date(deadlineDate);
  startDate.setDate(startDate.getDate() - DEFAULT_DEADLINE_DAYS);
  const total = deadlineDate.getTime() - startDate.getTime();
  
  if (total <= 0) return 0;
  
  return Math.min(100, Math.max(0, (diff / total) * 100));
};

// ============== CUSTOM HOOKS ==============
const useCountdowns = (templates: Template[]) => {
  const [timeLefts, setTimeLefts] = useState<Map<number, TimeLeft>>(new Map());

  const updateAllCountdowns = useCallback(() => {
    const newTimeLefts = new Map<number, TimeLeft>();
    
    templates.forEach((template) => {
      const deadlineDate = new Date(template.deadline);
      if (isNaN(deadlineDate.getTime())) return;
      
      newTimeLefts.set(template.id, calculateTimeLeft(deadlineDate));
    });
    
    setTimeLefts(newTimeLefts);
  }, [templates]);

  useEffect(() => {
    updateAllCountdowns();
    const interval = setInterval(updateAllCountdowns, COUNTDOWN_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateAllCountdowns]);

  return timeLefts;
};

const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/api/templates`, {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      
      if (!res.ok) throw new Error(`Failed to load templates: ${res.status}`);
      
      const data = await res.json();
      const activeTemplates = (data || []).filter(
        (t: Template) => t.deadline && t.status === "active"
      );
      
      setTemplates(activeTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError(error instanceof Error ? error.message : "Failed to load templates");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
};

// ============== SUBCOMPONENTS ==============
const TemplateCard = memo(({ template, timeLeft }: { template: Template; timeLeft: TimeLeft }) => {
  const progress = useMemo(() => calculateProgress(new Date(template.deadline)), [template.deadline]);
  const formattedTimeLeft = useMemo(() => formatTimeLeft(timeLeft), [timeLeft]);
  const isExpired = timeLeft.expired;

  return (
    <div
      className={cn(
        "group relative rounded-xl border transition-all duration-300 p-4",
        "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50",
        isExpired
          ? "border-red-200 dark:border-red-800 opacity-75"
          : "border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.02]"
      )}
    >
      {/* Template Title */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          "p-1.5 rounded-lg transition-colors",
          isExpired
            ? "bg-red-100 dark:bg-red-900/30"
            : "bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50"
        )}>
          <Timer className={cn(
            "h-3.5 w-3.5",
            isExpired
              ? "text-red-600 dark:text-red-400"
              : "text-indigo-600 dark:text-indigo-400"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {formatTitle(template)}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {formatDate(template.deadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-semibold",
            isExpired
              ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
              : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/30"
          )}>
            <Clock className="h-3 w-3" />
            <span>{formattedTimeLeft}</span>
          </div>
        </div>
        
        {!isExpired && (
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all group-hover:translate-x-0.5" />
        )}
      </div>

      {/* Progress Bar */}
      {!isExpired && (
        <div className="mt-3">
          <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

TemplateCard.displayName = "TemplateCard";

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-40 gap-3">
    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
    <p className="text-sm text-gray-500 dark:text-gray-400">Loading deadlines...</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-40 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
      <Clock className="h-6 w-6 text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No active deadlines</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Check back later for new templates</p>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-40 text-center">
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
      <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
    </div>
    <p className="text-sm font-medium text-red-600 dark:text-red-400">Failed to load</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{error}</p>
    <button
      onClick={onRetry}
      className="text-xs px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// ============== MAIN COMPONENT ==============
export const Rightbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { templates, loading, error, refetch } = useTemplates();
  const timeLefts = useCountdowns(templates);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [refetch]);

  const activeCount = templates.length;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Open deadlines panel"
      >
        <Timer className="h-5 w-5 transition-transform group-hover:scale-110" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {activeCount > 9 ? '9+' : activeCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-0 z-50 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl h-[calc(100vh-5rem)] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-white/20">
              <Timer className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">Active Deadlines</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close panel"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xs text-indigo-100">
            {activeCount} active template{activeCount !== 1 ? "s" : ""}
          </p>
          {activeCount > 0 && (
            <div className="h-1 w-1 rounded-full bg-indigo-300 animate-pulse" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : templates.length === 0 ? (
          <EmptyState />
        ) : (
          templates.map((template) => {
            const timeLeft = timeLefts.get(template.id) || { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
            return <TemplateCard key={template.id} template={template} timeLeft={timeLeft} />;
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Live updates</span>
          </div>
          <button
            onClick={refetch}
            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </div>
  );
};

export default Rightbar;