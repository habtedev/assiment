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
};

interface SidebarTemplatesCollapseProps {
  isSidebarOpen?: boolean;
}

export default function SidebarTemplatesCollapse({ isSidebarOpen = true }: SidebarTemplatesCollapseProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                !isSidebarOpen && "justify-center",
                isTemplatesRoute && !isOpen && "bg-indigo-50 dark:bg-indigo-950/40"
              )}
            >
              <div className="relative">
                <LayoutTemplate className={cn(
                  "h-4 w-4 transition-all",
                  isTemplatesRoute ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                )} />
                {MOCK_TEMPLATES.total > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-background" />
                )}
              </div>

              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-sm text-left font-medium">
                    Templates
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-full text-[10px] h-5 px-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                  >
                    {MOCK_TEMPLATES.total}
                  </Badge>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
                      <Badge className="rounded-full bg-indigo-500 text-white">
                        {MOCK_TEMPLATES.total}
                      </Badge>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-1 mt-1">
          <AnimatePresence mode="wait">

            <motion.div key="list" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
              <Link href="/dashboard/admin/templates">
                <Button
                  variant={isList ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative group",
                    !isSidebarOpen && "justify-center",
                    isList && "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                  )}
                >
                  <FileText className={cn(
                    "h-4 w-4",
                    isList ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"
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
                    isCreate && "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                  )}
                >
                  <PlusCircle className={cn(
                    "h-4 w-4",
                    isCreate ? "text-indigo-600" : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
                  )} />
                  {isSidebarOpen && (
                    <span className="flex-1 text-sm text-left">Create New</span>
                  )}
                </Button>
              </Link>
            </motion.div>

          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Active indicator for collapsed mode */}
      {!isSidebarOpen && isTemplatesRoute && (
        <motion.div
          layoutId="templatesActiveIndicator"
          className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        />
      )}
    </div>
  );
}