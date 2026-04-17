"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { StudentHeader } from "@/components/dashboard/student/layout/header";
import { AdminDashboardLayout } from "@/components/dashboard/student/layout/adminLayout";
import { DashboardOverview } from "@/components/dashboard/student/dashboard/DashboardOverview";
import { TemplateList } from "@/components/dashboard/student/dashboard/TemplateList";
import { TemplateDetail } from "@/components/dashboard/student/dashboard/TemplateDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  FileText,
  ChevronRight,
  Sparkles,
  Heart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";


 
export default function StudentDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [currentView, setCurrentView] = React.useState("overview"); // "overview", "templates", "detail"

  const handleTemplateSelect = (template: any) => {
    if (template?.showAllTemplates) {
      setSelectedTemplate(null);
      setCurrentView("templates");
    } else {
      setSelectedTemplate(template);
      setCurrentView("detail");
    }
  };

  const handleBackToOverview = () => {
    setSelectedTemplate(null);
    setCurrentView("overview");
  };

  const handleShowTemplates = () => {
    setSelectedTemplate(null);
    setCurrentView("templates");
  };

  return (
    <AdminDashboardLayout onTemplateSelect={handleTemplateSelect}>
      <div className="space-y-6">
        {currentView === "detail" && selectedTemplate ? (
          <TemplateDetail template={selectedTemplate} onBack={handleBackToOverview} />
        ) : currentView === "templates" ? (
          <TemplateList onTemplateSelect={handleTemplateSelect} />
        ) : (
          <DashboardOverview userName="Abebe Kebede" />
        )}
      </div>
    </AdminDashboardLayout>
  );
}