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
  Copy,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  List,
  LayoutGrid,
  Heart,
} from "lucide-react";

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
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">Active</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs border-indigo-200 dark:border-indigo-800">Draft</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs border-gray-200 dark:border-gray-700">Archived</Badge>;
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
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Assessment Templates
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Create, manage, and organize your evaluation templates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg gap-2 h-8 cursor-pointer"
              onClick={() => router.push("/dashboard/admin/templates/import")}
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/admin/templates/new")}
              className="rounded-lg gap-2 h-8 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Template</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
                </div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {templates.filter(t => t.status === "active").length}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Draft</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {templates.filter(t => t.status === "draft").length}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Responses</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {templates.reduce((sum, t) => sum + (t.responseCount || 0), 0)}
                  </p>
                </div>
                <Heart className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-lg h-9 border-gray-200 dark:border-gray-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg gap-2 h-9 border-gray-200 dark:border-gray-700 cursor-pointer">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">
                        {filterStatus === "all" ? "All Status" : filterStatus}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuLabel className="text-xs">Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus("all")} className="text-xs cursor-pointer">
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")} className="text-xs cursor-pointer">
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("draft")} className="text-xs cursor-pointer">
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("archived")} className="text-xs cursor-pointer">
                      Archived
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg gap-2 h-9 border-gray-200 dark:border-gray-700 cursor-pointer">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("date")} className="text-xs cursor-pointer">
                      Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")} className="text-xs cursor-pointer">
                      Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("status")} className="text-xs cursor-pointer">
                      Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="text-xs cursor-pointer">
                      Toggle Order ({sortOrder === "asc" ? "Ascending" : "Descending"})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <Card className="border border-dashed border-gray-300 dark:border-gray-700">
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">No templates found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Get started by creating your first assessment template"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button
                  onClick={() => router.push("/dashboard/admin/templates/new")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const lang = i18n?.language || "en";
              const title = typeof template.title === 'object' ? template.title[lang] || template.title['en'] : template.title;
              const description = typeof template.description === 'object' ? template.description[lang] || template.description['en'] : template.description;
              return (
                <Card
                  key={template.id}
                  className="group hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                  onClick={() => router.push(`/dashboard/admin/templates/${template.id}/preview`)}
                >
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-sm line-clamp-1 font-semibold">
                            {title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-xs mt-0.5">
                            {description || "No description"}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg cursor-pointer">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/templates/${template.id}/preview`);
                          }} className="text-xs cursor-pointer">
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/templates/${template.id}/edit`);
                          }} className="text-xs cursor-pointer">
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 text-xs cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 pt-0 px-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{template.academicYear} • {template.semester}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <User className="h-3 w-3" />
                      <span>Created by: {template.createdById}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(template.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Badge variant="secondary" className="rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {template.questionCount} Q
                      </Badge>
                      <Badge variant="secondary" className="rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {template.responseCount} R
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 px-4 pb-3">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(template.status)}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
          </div>
        ) : (
          // List View
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Title</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Questions</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Responses</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Created</th>
                      <th className="text-right p-3 text-xs font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template) => (
                      <tr
                        key={template.id}
                        className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/admin/templates/${template.id}/preview`)}
                      >
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm">
                              {typeof template.title === 'object' ? template.title['en'] || Object.values(template.title)[0] : template.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {typeof template.description === 'object' ? template.description['en'] || Object.values(template.description)[0] : template.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(template.status)}</td>
                        <td className="p-3 text-sm">{template.questionCount}</td>
                        <td className="p-3 text-sm">{template.responseCount}</td>
                        <td className="p-3 text-xs">{formatDate(template.createdAt)}</td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg cursor-pointer">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/admin/templates/${template.id}/preview`);
                              }} className="text-xs cursor-pointer">
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/admin/templates/${template.id}/edit`);
                              }} className="text-xs cursor-pointer">
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(template);
                              }} className="text-xs cursor-pointer">
                                <Copy className="h-3.5 w-3.5 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 text-xs cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTemplate(template);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
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
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 w-full max-w-md">
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