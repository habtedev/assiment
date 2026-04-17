"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  BookOpen,
  BarChart3,
  Award,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Star,
  Filter,
  Search,
  Grid3x3,
  List,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  type: "assessment" | "course" | "grade" | "project";
  status: "active" | "completed" | "pending" | "draft";
  progress: number;
  dueDate?: string;
  startDate?: string;
  icon: React.ElementType;
  color: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: string;
  instructor?: string;
  rating?: number;
  submissions?: number;
  tags?: string[];
}

interface TemplateListProps {
  onTemplateSelect?: (template: Template) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  compact?: boolean;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  onTemplateSelect,
  showFilters = true,
  showSearch = true,
  compact = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setMounted(true);
  }, []);

  const templates: Template[] = [
    {
      id: "assessment-1",
      title: "Midterm Assessment",
      description: "Computer Science Fundamentals - Comprehensive evaluation of core concepts",
      type: "assessment",
      status: "active",
      progress: 75,
      dueDate: "2024-04-15",
      startDate: "2024-04-01",
      icon: FileText,
      color: "from-amber-500 to-rose-500",
      difficulty: "intermediate",
      estimatedTime: "2 hours",
      instructor: "Dr. Abebe Kebede",
      rating: 4.5,
      submissions: 156,
      tags: ["programming", "algorithms", "data-structures"],
    },
    {
      id: "course-1",
      title: "Data Structures",
      description: "Advanced Programming Concepts - Learn complex data structures and algorithms",
      type: "course",
      status: "completed",
      progress: 100,
      dueDate: "2024-04-10",
      startDate: "2024-03-15",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      difficulty: "advanced",
      estimatedTime: "4 weeks",
      instructor: "Prof. Solomon Tesfaye",
      rating: 4.8,
      submissions: 89,
      tags: ["algorithms", "data-structures", "advanced"],
    },
    {
      id: "assessment-2",
      title: "Final Project",
      description: "Software Engineering Project - Build a complete application from scratch",
      type: "project",
      status: "pending",
      progress: 30,
      dueDate: "2024-04-20",
      startDate: "2024-04-05",
      icon: FileText,
      color: "from-purple-500 to-indigo-500",
      difficulty: "advanced",
      estimatedTime: "3 weeks",
      instructor: "Dr. Almaz Bekele",
      rating: 4.2,
      submissions: 45,
      tags: ["software-engineering", "project", "teamwork"],
    },
    {
      id: "grade-1",
      title: "Academic Grades",
      description: "View Your Academic Performance - Comprehensive grade report and analytics",
      type: "grade",
      status: "active",
      progress: 60,
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      difficulty: "beginner",
      estimatedTime: "15 minutes",
      rating: 4.0,
      submissions: 234,
      tags: ["grades", "analytics", "performance"],
    },
    {
      id: "assessment-3",
      title: "Lab Assessment",
      description: "Database Management Systems - Practical database design and implementation",
      type: "assessment",
      status: "active",
      progress: 45,
      dueDate: "2024-04-18",
      startDate: "2024-04-08",
      icon: FileText,
      color: "from-orange-500 to-red-500",
      difficulty: "intermediate",
      estimatedTime: "1.5 hours",
      instructor: "Dr. Yonas Haile",
      rating: 4.3,
      submissions: 78,
      tags: ["database", "sql", "practical"],
    },
    {
      id: "course-2",
      title: "Web Development",
      description: "Modern Web Technologies - Learn React, Next.js and modern web frameworks",
      type: "course",
      status: "active",
      progress: 85,
      dueDate: "2024-04-25",
      startDate: "2024-03-20",
      icon: BookOpen,
      color: "from-pink-500 to-rose-500",
      difficulty: "intermediate",
      estimatedTime: "6 weeks",
      instructor: "Prof. Hanna Tadesse",
      rating: 4.7,
      submissions: 112,
      tags: ["web-development", "react", "javascript"],
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || template.type === filterType;
    const matchesStatus = filterStatus === "all" || template.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "dueDate":
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      case "progress":
        return b.progress - a.progress;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template.id);
    onTemplateSelect?.(template);
    toast({
      title: "Template Selected",
      description: `You selected "${template.title}"`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "pending":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      case "draft":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-3 w-3" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Pause className="h-3 w-3" />;
      case "draft":
        return <RotateCcw className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "intermediate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "advanced":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assessment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "course":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "grade":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "project":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
            Template Library
          </h2>
          <p className="text-muted-foreground">Browse and manage your assessment templates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-amber-200/50 dark:border-amber-800/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-amber-200/50 dark:border-amber-800/50 focus:border-amber-500 dark:focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
              {showFilters && (
                <div className="flex flex-wrap gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="assessment">Assessments</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                      <SelectItem value="grade">Grades</SelectItem>
                      <SelectItem value="project">Projects</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {sortedTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedTemplate === template.id
                  ? "ring-2 ring-amber-500/50 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30"
                  : "hover:border-amber-400/50 dark:hover:border-amber-600/50",
                compact && "p-4"
              )}
              onClick={() => handleTemplateClick(template)}
            >
              <CardHeader className={cn(compact && "pb-2")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 p-2 rounded-lg",
                      `bg-gradient-to-br ${template.color}`
                    )}>
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className={cn(
                        "text-base line-clamp-1",
                        compact && "text-sm"
                      )}>
                        {template.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn("text-xs", getTypeColor(template.type))}>
                          {template.type}
                        </Badge>
                        <Badge className={cn("text-xs gap-1", getStatusColor(template.status))}>
                          {getStatusIcon(template.status)}
                          {template.status}
                        </Badge>
                        {template.difficulty && (
                          <Badge className={cn("text-xs", getDifficultyColor(template.difficulty))}>
                            {template.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </CardHeader>
              <CardContent className={cn(compact && "pt-0")}>
                <CardDescription className={cn(
                  "line-clamp-2 mb-3",
                  compact && "text-xs line-clamp-1"
                )}>
                  {template.description}
                </CardDescription>
                
                {/* Tags */}
                {template.tags && template.tags.length > 0 && !compact && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Progress */}
                {template.progress !== undefined && (
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{template.progress}%</span>
                    </div>
                    <Progress value={template.progress} className="h-1" />
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {template.instructor && (
                      <div className="flex items-center gap-1">
                        <span>Instructor: {template.instructor}</span>
                      </div>
                    )}
                    {template.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {template.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{template.rating}</span>
                      </div>
                    )}
                    {template.submissions && (
                      <div className="flex items-center gap-1">
                        <span>{template.submissions} submissions</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                {template.dueDate && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {template.dueDate}</span>
                    </div>
                    {template.startDate && (
                      <div className="flex items-center gap-1">
                        <span>Started: {template.startDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-amber-200/50 dark:border-amber-800/50">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Details */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border-amber-200/50 dark:border-amber-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Template Selected: {templates.find(t => t.id === selectedTemplate)?.title}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateList;
