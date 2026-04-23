"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, Timer, Calendar, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

interface Template {
  id: number;
  title: string;
  name?: string;
  deadline: string;
  status: string;
}

export const Rightbar = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [timeLefts, setTimeLefts] = useState<Record<number, string>>({});

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      // Filter templates with deadlines and active status
      const activeTemplates = (data || []).filter(
        (t: Template) => t.deadline && t.status === "active"
      );
      setTemplates(activeTemplates);
    } catch (error) {
      console.error(error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Update countdowns every second
  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeLefts: Record<number, string> = {};
      templates.forEach((template) => {
        const now = new Date();
        const deadlineDate = new Date(template.deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0) {
          newTimeLefts[template.id] = "Expired";
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        newTimeLefts[template.id] = `${d}d ${h}h ${m}m ${s}s`;
      });
      setTimeLefts(newTimeLefts);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [templates]);

  const formatTitle = (template: Template) => {
    if (typeof template.title === "string" && template.title.trim()) return template.title;
    if (typeof template.name === "string" && template.name.trim()) return template.name;
    return "Untitled Template";
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-0 z-50 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-3 py-2 rounded-l-lg shadow-lg hover:shadow-xl transition-all"
      >
        <Timer className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-0 z-50 w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-500 to-rose-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-white" />
            <h3 className="text-sm font-bold text-white">Active Deadlines</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-amber-100 mt-1">
          {templates.length} assessment{templates.length !== 1 ? "s" : ""} with active deadlines
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Loading...
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p>No active deadlines</p>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 p-4 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              {/* Template Title */}
              <div className="flex items-start gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Timer className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {formatTitle(template)}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-2.5 w-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">{formatDate(template.deadline)}</p>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 dark:from-amber-500/20 dark:to-rose-500/20 px-3 py-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/30">
                    <Clock className="h-3 w-3" />
                    {timeLefts[template.id] || "Loading..."}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{
                      width: (() => {
                        const now = new Date();
                        const deadlineDate = new Date(template.deadline);
                        const diff = deadlineDate.getTime() - now.getTime();
                        const total = deadlineDate.getTime() - new Date(template.deadline).setDate(deadlineDate.getDate() - 30);
                        if (diff <= 0) return "100%";
                        if (total <= 0) return "0%";
                        return `${Math.min(100, Math.max(0, (diff / total) * 100))}%`;
                      })(),
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live updates</span>
        </div>
      </div>
    </div>
  );
};
