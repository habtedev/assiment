"use client";

import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  Loader2,
  Sparkles,
  Heart,
  Shield,
  Copy,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Grid3x3,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

interface Template {
  id: string;
  title: string | Record<string, string>;
  description: string | Record<string, string>;
  createdById: string;
  createdAt: string;
  updatedAt?: string;
  status?: "draft" | "active" | "archived";
  questionCount?: number;
  responseCount?: number;
  collegeId?: string;
  semester?: string;
  academicYear?: string;
}

export default function TemplatesPage() {
  // ...existing code...
  const router = useRouter();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "active" | "archived">("all");
  const [editMode, setEditMode] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      // Check if backend returns { templates: [...] }
      const templatesArray = Array.isArray(data) ? data : data.templates;
      const enrichedData = templatesArray.map((template: any, index: number) => ({
        ...template,
        status: index % 3 === 0 ? "active" : index % 3 === 1 ? "draft" : "archived",
        questionCount: Math.floor(Math.random() * 20) + 5,
        responseCount: Math.floor(Math.random() * 500),
        semester: index % 2 === 0 ? "Semester I" : "Semester II",
        academicYear: "2024/25",
      }));
      setTemplates(enrichedData);
      setFilteredTemplates(enrichedData);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
      setTemplates([]);
      setFilteredTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Filter and sort templates
  useEffect(() => {
    let filtered = [...templates];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => {
        const title = typeof t.title === 'object' ? t.title['en'] || Object.values(t.title)[0] : t.title;
        const description = typeof t.description === 'object' ? t.description['en'] || Object.values(t.description)[0] : t.description;
        return (
          title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case "title": {
          const lang = i18n?.language || "en";
          const aTitle = typeof a.title === 'object' ? a.title[lang] || a.title['en'] : a.title;
          const bTitle = typeof b.title === 'object' ? b.title[lang] || b.title['en'] : b.title;
          comparison = aTitle.localeCompare(bTitle);
          break;
        }
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, filterStatus, sortBy, sortOrder]);

  // Delete template
  const handleDelete = async () => {
    if (!selectedTemplate) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/templates/${selectedTemplate.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete template");

      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
      toast({
        title: "✅ Template Deleted",
        description: `"${selectedTemplate.title}" has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    }
  };

  // Duplicate template
  const handleDuplicate = async (template: Template) => {
    try {
      // In a real app, you'd call an API endpoint to duplicate
      // For now, we'll just simulate it
      const duplicated = {
        ...template,
        id: `temp-${Date.now()}`,
        title: `${template.title} (Copy)`,
        createdAt: new Date().toISOString(),
        status: "draft" as const,
      };

      setTemplates(prev => [duplicated, ...prev]);
      toast({
        title: "📋 Template Duplicated",
        description: `A copy of "${template.title}" has been created.`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to duplicate template.",
        variant: "destructive",
      });
    }
  };

  // Edit template
  const handleEdit = (template: Template) => {
    setEditMode(true);
    // For title
    let title = template.title;
    if (typeof title === 'object') {
      title = title['en'] || Object.values(title)[0] || '';
    }
    // For description
    let description = template.description;
    if (typeof description === 'object') {
      description = description['en'] || Object.values(description)[0] || '';
    }
    setEditTemplate(template);
    setEditTitle(title);
    setEditDescription(description);
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">Active</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">Draft</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full">Archived</Badge>;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Loading skeleton
  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <img src="/gondar-university.jpg" alt="University of Gondar" className="w-64 h-64 object-cover rounded-full shadow-lg mb-6" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-50 to-rose-50 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1 text-amber-600" />
                Template Management
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
              Assessment Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, manage, and organize your evaluation templates
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={() => router.push("/dashboard/admin/templates/import")}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/admin/templates/new")}
              className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Template</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-500 to-rose-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active</p>
                  <p className="text-2xl font-bold">
                    {templates.filter(t => t.status === "active").length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Draft</p>
                  <p className="text-2xl font-bold">
                    {templates.filter(t => t.status === "draft").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Responses</p>
                  <p className="text-2xl font-bold">
                    {templates.reduce((sum, t) => sum + (t.responseCount || 0), 0)}
                  </p>
                </div>
                <Heart className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-full"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {filterStatus === "all" ? "All Status" : filterStatus}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                      Archived
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("date")}>
                      Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("status")}>
                      Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                      Toggle Order ({sortOrder === "asc" ? "Ascending" : "Descending"})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-full p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Get started by creating your first assessment template"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button
                  onClick={() => router.push("/dashboard/admin/templates/new")}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const lang = i18n?.language || "en";
              const title = typeof template.title === 'object' ? template.title[lang] || template.title['en'] : template.title;
              const description = typeof template.description === 'object' ? template.description[lang] || template.description['en'] : template.description;
              return (
                <Card
                  key={template.id}
                  className="group hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                  onClick={() => router.push(`/dashboard/admin/templates/${template.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base line-clamp-1">
                              {title}
                            </CardTitle>
                          </div>
                          <CardDescription className="line-clamp-2 text-xs">
                            {description || "No description"}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/templates/${template.id}/preview`);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/templates/${template.id}/edit`);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {template.academicYear} • {template.semester}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-xs">Created by: {template.createdById}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{formatDate(template.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {template.questionCount} Q
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {template.responseCount} R
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(template.status)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
          </div>
        ) : (
          // List View
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Title</th>
                      <th className="text-left p-4 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-sm font-medium">Questions</th>
                      <th className="text-left p-4 text-sm font-medium">Responses</th>
                      <th className="text-left p-4 text-sm font-medium">Created</th>
                      <th className="text-right p-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template) => (
                      <tr
                        key={template.id}
                        className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/admin/templates/${template.id}`)}
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">
                              {typeof template.title === 'object' ? template.title['en'] || Object.values(template.title)[0] : template.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {typeof template.description === 'object' ? template.description['en'] || Object.values(template.description)[0] : template.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(template.status)}</td>
                        <td className="p-4">{template.questionCount}</td>
                        <td className="p-4">{template.responseCount}</td>
                        <td className="p-4 text-sm">{formatDate(template.createdAt)}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/admin/templates/${template.id}/preview`);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/admin/templates/${template.id}/edit`);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(template);
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-rose-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTemplate(template);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Delete Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                let title = selectedTemplate?.title;
                if (title && typeof title === 'object') {
                  const lang = i18n?.language || 'en';
                  title = title[lang] || title['en'] || Object.values(title)[0];
                }
                return `Are you sure you want to delete "${title}"? This action cannot be undone.`;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editMode && editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Template</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <Input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setEditMode(false); setEditTemplate(null); }}>Cancel</Button>
              <Button
                onClick={() => {
                  setTemplates(prev => prev.map(t =>
                    t.id === editTemplate.id
                      ? { ...t, title: editTitle, description: editDescription }
                      : t
                  ));
                  setFilteredTemplates(prev => prev.map(t =>
                    t.id === editTemplate.id
                      ? { ...t, title: editTitle, description: editDescription }
                      : t
                  ));
                  toast({ title: "Template Updated", description: `"${editTitle}" updated.` });
                  setEditMode(false);
                  setEditTemplate(null);
                }}
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white"
              >Save</Button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}