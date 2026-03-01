"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  PlusCircle,
  ChevronRight,
  LayoutTemplate,
  Copy,
  Eye,
  Archive,
  Clock,
  Star,
  Sparkles,
  Heart,
  Layers,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data - replace with real data from your backend
const MOCK_TEMPLATES = {
  total: 12,
  active: 5,
  draft: 4,
  archived: 3,
  recent: [
    { id: 1, name: "Semester I Evaluation", status: "active", updatedAt: "2h ago" },
    { id: 2, name: "College of Informatics", status: "draft", updatedAt: "1d ago" },
    { id: 3, name: "Q4 Report 2025", status: "active", updatedAt: "3d ago" },
  ],
};

interface SidebarTemplatesCollapseProps {
  isSidebarOpen?: boolean;
}

export default function SidebarTemplatesCollapse({ isSidebarOpen = true }: SidebarTemplatesCollapseProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Check if current route is templates related
  const isTemplatesRoute = pathname?.startsWith("/dashboard/admin/templates");
  const isList = pathname === "/dashboard/admin/templates";
  const isCreate = pathname === "/dashboard/admin/templates/new";
  const isEdit = pathname?.includes("/dashboard/admin/templates/edit");
  const isView = pathname?.includes("/dashboard/admin/templates/view");

  // Auto-expand if on templates route
  useEffect(() => {
    if (isTemplatesRoute) {
      setIsOpen(true);
    }
  }, [isTemplatesRoute]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const statsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div className="space-y-1">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="relative">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                !isSidebarOpen && "justify-center",
                isTemplatesRoute && !isOpen && "bg-amber-50/50 dark:bg-amber-950/30"
              )}
            >
              <div className="relative">
                <LayoutTemplate className={cn(
                  "h-4 w-4 transition-all",
                  isTemplatesRoute ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                )} />
                {MOCK_TEMPLATES.total > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-background" />
                )}
              </div>
              
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-sm text-left font-medium">
                    Templates
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="rounded-full text-[10px] h-5 px-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    {MOCK_TEMPLATES.total}
                  </Badge>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </>
              )}

              {!isSidebarOpen && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="absolute inset-0" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2">
                      <span>Templates</span>
                      <Badge className="rounded-full bg-amber-500 text-white">
                        {MOCK_TEMPLATES.total}
                      </Badge>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Button>
          </CollapsibleTrigger>

          {/* Quick stats toggle button - only when open */}
          {isSidebarOpen && isOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
              onClick={() => setShowStats(!showStats)}
            >
              <Sparkles className={cn(
                "h-3 w-3 transition-all",
                showStats ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
              )} />
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-1 mt-1">
          <AnimatePresence mode="wait">
            {showStats && isSidebarOpen && (
              <motion.div
                key="stats"
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-2 p-2 rounded-lg bg-linear-to-br from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30 border border-amber-200/50 dark:border-amber-800/50"
              >
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="p-1">
                    <div className="text-xs font-semibold text-emerald-600">5</div>
                    <div className="text-[8px] text-muted-foreground">Active</div>
                  </div>
                  <div className="p-1">
                    <div className="text-xs font-semibold text-amber-600">4</div>
                    <div className="text-[8px] text-muted-foreground">Draft</div>
                  </div>
                  <div className="p-1">
                    <div className="text-xs font-semibold text-slate-600">3</div>
                    <div className="text-[8px] text-muted-foreground">Archive</div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div key="list" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
              <Link href="/dashboard/admin/templates">
                <Button
                  variant={isList ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative group",
                    !isSidebarOpen && "justify-center",
                    isList && "bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  )}
                >
                  <FileText className={cn(
                    "h-4 w-4",
                    isList ? "text-amber-600" : "text-muted-foreground"
                  )} />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-sm text-left">All Templates</span>
                      {MOCK_TEMPLATES.total > 0 && (
                        <Badge variant="outline" className="rounded-full text-[10px] h-5 px-1.5">
                          {MOCK_TEMPLATES.total}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            </motion.div>

            <motion.div key="create" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
              <Link href="/dashboard/admin/templates/new">
                <Button
                  variant={isCreate ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                    !isSidebarOpen && "justify-center",
                    isCreate && "bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  )}
                >
                  <PlusCircle className={cn(
                    "h-4 w-4",
                    isCreate ? "text-amber-600" : "text-muted-foreground group-hover:text-amber-500"
                  )} />
                  {isSidebarOpen && (
                    <span className="flex-1 text-sm text-left">Create New</span>
                  )}
                </Button>
              </Link>
            </motion.div>

            {isSidebarOpen && (
              <React.Fragment key="quick-actions">
                {/* Recent Templates */}
                <motion.div
                  key="recent"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="pt-2 mt-2 border-t border-amber-200/30 dark:border-amber-800/30"
                >
                  <div className="px-3 py-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Recent
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {MOCK_TEMPLATES.recent.map((template) => (
                      <Link key={template.id} href={`/dashboard/admin/templates/${template.id}`}>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center gap-2 px-3 py-1.5 h-auto rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            template.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                          )} />
                          <span className="flex-1 text-xs text-left truncate">{template.name}</span>
                          <span className="text-[8px] text-muted-foreground">{template.updatedAt}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                  key="categories"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="pt-2"
                >
                  <div className="px-3 py-1 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Categories
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {[
                      { label: "Active", count: 5, color: "emerald" },
                      { label: "Draft", count: 4, color: "amber" },
                      { label: "Archived", count: 3, color: "slate" },
                    ].map((cat) => (
                      <Button
                        key={cat.label}
                        variant="ghost"
                        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 h-auto rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            `bg-${cat.color}-500`
                          )} />
                          <span className="text-xs">{cat.label}</span>
                        </div>
                        <Badge variant="outline" className="rounded-full text-[8px] h-4 px-1">
                          {cat.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              </React.Fragment>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Active indicator for collapsed mode */}
      {!isSidebarOpen && isTemplatesRoute && (
        <motion.div
          layoutId="templatesActiveIndicator"
          className="absolute left-0 w-1 h-8 bg-amber-500 rounded-r-full"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        />
      )}
    </div>
  );
}