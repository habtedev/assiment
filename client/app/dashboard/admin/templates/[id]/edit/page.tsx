"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { TemplateBuilderDialog } from "@/features/template-builder/TemplateBuilderDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const unwrappedParams = await params;
        const templateId = unwrappedParams.id;
        
        const res = await fetch(`${API_BASE_URL}/api/templates/${templateId}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Template not found");
          }
          throw new Error("Failed to fetch template");
        }
        
        const data = await res.json();
        setTemplate(data);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchTemplate();
  }, [params, toast]);

  const handleSave = async (updatedTemplate: any) => {
    try {
      const unwrappedParams = await params;
      const templateId = unwrappedParams.id;
      
      const res = await fetch(`${API_BASE_URL}/api/templates/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedTemplate),
      });

      if (!res.ok) throw new Error("Failed to update template");

      toast({
        title: "✅ Template Updated",
        description: "Your template has been updated successfully.",
      });
      
      router.push("/dashboard/admin/templates");
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !template) {
    return (
      <AdminDashboardLayout>
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mb-4 h-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-3" />
              <h2 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white">Template Not Found</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error || "The template you're trying to edit doesn't exist."}
              </p>
              <Button onClick={() => router.push("/dashboard/admin/templates")} className="cursor-pointer">
                Return to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 mb-4 h-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>

        <TemplateBuilderDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              router.push("/dashboard/admin/templates");
            }
          }}
          onSave={handleSave}
          initial={template}
          isEdit={true}
        />
      </div>
    </AdminDashboardLayout>
  );
}