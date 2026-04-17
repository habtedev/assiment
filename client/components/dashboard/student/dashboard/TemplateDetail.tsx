"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  BookOpen,
  BarChart3,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Users,
  Star,
  TrendingUp,
  ArrowLeft,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  ThumbsUp,
  Heart,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TemplateDetailProps {
  template: any;
  onBack?: () => void;
}

export const TemplateDetail: React.FC<TemplateDetailProps> = ({ template, onBack }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!template) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No template selected</h3>
          <p className="text-sm text-muted-foreground">Select a template from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "pending":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
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
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return FileText;
      case "course":
        return BookOpen;
      case "grade":
        return BarChart3;
      case "project":
        return Award;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assessment":
        return "from-amber-500 to-rose-500";
      case "course":
        return "from-emerald-500 to-teal-500";
      case "grade":
        return "from-blue-500 to-cyan-500";
      case "project":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const Icon = getTypeIcon(template.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={cn(
            "p-3 rounded-lg bg-gradient-to-br",
            getTypeColor(template.type)
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn("text-xs gap-1", getStatusColor(template.status))}>
                {getStatusIcon(template.status)}
                {template.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {template.type}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700">
            {template.status === "completed" ? "Review" : "Start"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {template.progress !== undefined && template.progress < 100 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{template.progress}%</span>
            </div>
            <Progress value={template.progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{template.type}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={cn("gap-1", getStatusColor(template.status))}>
                  {getStatusIcon(template.status)}
                  {template.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{template.progress || 0}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This {template.type} provides comprehensive learning materials and assessments 
                to help you master the subject matter. Interactive content and real-world 
                examples are included to enhance your understanding.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Understand core concepts and principles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Apply knowledge to practical problems</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Develop critical thinking skills</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Structured learning materials and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Introduction", duration: "15 min", completed: true },
                  { title: "Core Concepts", duration: "45 min", completed: true },
                  { title: "Practical Examples", duration: "30 min", completed: false },
                  { title: "Assessment", duration: "20 min", completed: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        item.completed ? "bg-emerald-500" : "bg-muted"
                      )}>
                        {item.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <span className={cn(
                        "text-sm",
                        item.completed ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Student submissions and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Abebe Kebede", score: 92, date: "2 hours ago", status: "graded" },
                  { name: "Almaz Bekele", score: 85, date: "5 hours ago", status: "graded" },
                  { name: "Solomon Tesfaye", score: 78, date: "1 day ago", status: "graded" },
                ].map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {submission.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{submission.name}</p>
                        <p className="text-xs text-muted-foreground">{submission.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {submission.score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Ask questions and share insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { author: "Dr. Abebe Kebede", message: "Remember to review the prerequisites before starting.", replies: 3, likes: 12, time: "2 hours ago" },
                  { author: "Hanna Tadesse", message: "The practical examples are very helpful!", replies: 1, likes: 8, time: "5 hours ago" },
                ].map((discussion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {discussion.author.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{discussion.author}</p>
                        <p className="text-xs text-muted-foreground">{discussion.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{discussion.message}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {discussion.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {discussion.replies}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TemplateDetail;
