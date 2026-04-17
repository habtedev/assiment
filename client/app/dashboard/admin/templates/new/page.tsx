"use client";

import { useEffect } from "react";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { TemplateBuilderDialog } from "@/features/template-builder/TemplateBuilderDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

export default function NewTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Prevent accidental navigation/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSave = async (data: any) => {
    toast({
      title: "✅ Template Created",
      description: "Your template has been created successfully.",
    });
    router.push("/dashboard/admin/templates");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col space-y-3 max-w-7xl mx-auto pb-4">

        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col space-y-2 px-4 sm:px-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/admin/templates">Templates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard/admin/templates")}
                className="rounded-full bg-white shadow-sm hover:bg-gray-50 shrink-0 h-8 w-8 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    New Template
                  </h1>
                  <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-500/10 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" /> Draft Mode
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  Building for Academic Year 2016 E.C.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="relative w-full">
          <div className="relative z-10 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            <TemplateBuilderDialog
              open={true}
              onOpenChange={(open) => {
                if (!open) {
                  router.push("/dashboard/admin/templates");
                }
              }}
              onSave={handleSave}
            />
          </div>
        </div>

      </div>
    </AdminDashboardLayout>
  );
}