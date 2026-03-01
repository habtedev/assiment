"use client";

import { useState } from "react";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { TemplateBuilderDialog } from "@/features/template-builder/TemplateBuilderDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Shield,
  FileText,
  Info,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      // Prepare payload for backend (Amharic and English)
      const payload = {
        title: {
          en: data.name?.en || "",
          am: data.name?.am || "",
        },
        description: {
          en: data.intro?.en || "",
          am: data.intro?.am || "",
        },
        why: {
          en: data.why?.en || "",
          am: data.why?.am || "",
        },
        academicYear: data.academicYear,
        semester: data.semester,
        questions: data.questions,
        content: data, // full form data for flexibility
        isDraft: false,
        createdById: 1, // TODO: Replace with real user id from auth
      };
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create template");
      toast({
        title: "✨ Template Created Successfully",
        description: "Your new assessment template is ready to use.",
      });
      router.push("/dashboard/admin/templates");
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full max-w-none p-0">
        {/* Header with Gradient Background */}
          <div className="relative overflow-hidden bg-linear-to-r from-amber-50 via-white to-rose-50 dark:from-amber-950/30 dark:via-slate-950 dark:to-rose-950/30 border-b border-amber-200/50 dark:border-amber-800/50">
          {/* Decorative Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-linear-to-r from-amber-200/30 to-rose-200/30 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="px-4 sm:px-6 py-6">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/admin" className="text-muted-foreground hover:text-amber-600">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/admin/templates" className="text-muted-foreground hover:text-amber-600">
                    Templates
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-amber-700 dark:text-amber-400">
                    Create New
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard/admin/templates")}
                    className="rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 relative group"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-popover px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Back to Templates
                    </span>
                  </Button>
                </motion.div>

                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-rose-600 rounded-xl blur-lg opacity-40 animate-pulse" />
                      <div className="relative h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                        <FileText className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                        Create New Template
                      </h1>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                        Design your assessment template with multi-language support
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Quick Tips Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTips(!showTips)}
                      className={cn(
                        "rounded-full gap-2 transition-all",
                        showTips && "bg-amber-100/50 dark:bg-amber-900/30 border-amber-200"
                      )}
                    >
                      <Info className="h-4 w-4" />
                      <span className="hidden sm:inline">Quick Tips</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle helpful tips</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Quick Tips Panel */}
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-linear-to-r from-amber-100/50 to-rose-100/50 dark:from-amber-900/30 dark:to-rose-900/30 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">✨ Pro Tips for Creating Great Templates:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Add clear, concise questions in all supported languages</li>
                        <li>Use multiple choice for objective assessments</li>
                        <li>Include at least one paragraph question for detailed feedback</li>
                        <li>Set appropriate weights for each question (1-5)</li>
                        <li>Preview your template before saving</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          <motion.div
            className="h-0.5 bg-linear-to-r from-amber-500 to-rose-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
              <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-linear-to-r from-amber-200/20 to-rose-200/20 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl" />
              <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-linear-to-r from-amber-200/20 to-rose-200/20 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl" />
            </div>

            {/* Form Container */}
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-amber-200/50 dark:border-amber-800/50 bg-linear-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h2 className="font-semibold">Template Details</h2>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-1 border-amber-200 bg-white/50 dark:bg-slate-900/50">
                    <Shield className="h-3 w-3 mr-1 text-amber-500" />
                    Draft Mode
                  </Badge>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <TemplateBuilderDialog
                  open={true}
                  onOpenChange={(open) => {
                    if (!open && !isSaving) {
                      router.push("/dashboard/admin/templates");
                    }
                  }}
                  onSave={handleSave}
                />
              </div>

              {/* Form Footer */}
              <div className="px-6 py-4 border-t border-amber-200/50 dark:border-amber-800/50 bg-linear-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/20 dark:to-rose-950/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    <span>All changes are saved locally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-amber-500" />
                    <span>Secure • v3.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Need help? Check out our{" "}
              <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline underline-offset-2">
                template guide
              </button>{" "}
              or{" "}
              <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline underline-offset-2">
                contact support
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}