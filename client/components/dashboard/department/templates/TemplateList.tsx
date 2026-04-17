"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for templates
const templates = [
  {
    id: 1,
    title: "Student Registration Form",
    description: "New student enrollment and registration",
    type: "form",
    status: "active",
    progress: 100,
    responses: 1250,
    createdAt: "2024-01-15",
    icon: FileText
  },
  {
    id: 2,
    title: "Course Syllabus Template",
    description: "Standard course syllabus format",
    type: "document",
    status: "completed",
    progress: 100,
    responses: 890,
    createdAt: "2024-01-20",
    icon: FileText
  },
  {
    id: 3,
    title: "Exam Schedule",
    description: "Semester examination schedule",
    type: "calendar",
    status: "pending",
    progress: 60,
    responses: 450,
    createdAt: "2024-02-01",
    icon: Calendar
  },
  {
    id: 4,
    title: "Grade Report",
    description: "Student grade evaluation report",
    type: "analytics",
    status: "active",
    progress: 85,
    responses: 680,
    createdAt: "2024-02-10",
    icon: FileText
  },
  {
    id: 5,
    title: "Teacher Evaluation",
    description: "Faculty performance assessment",
    type: "form",
    status: "pending",
    progress: 45,
    responses: 320,
    createdAt: "2024-02-15",
    icon: Users
  },
  {
    id: 6,
    title: "Course Feedback",
    description: "Student course feedback form",
    type: "form",
    status: "active",
    progress: 75,
    responses: 540,
    createdAt: "2024-02-20",
    icon: FileText
  },
  {
    id: 7,
    title: "Attendance Tracker",
    description: "Daily attendance monitoring",
    type: "analytics",
    status: "completed",
    progress: 100,
    responses: 1100,
    createdAt: "2024-03-01",
    icon: Clock
  },
  {
    id: 8,
    title: "Assignment Submission",
    description: "Student assignment tracking",
    type: "form",
    status: "pending",
    progress: 30,
    responses: 280,
    createdAt: "2024-03-05",
    icon: FileText
  },
];

export default function TemplateList() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Templates</h2>
          <p className="text-muted-foreground">Manage department templates</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{templates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {templates.filter(t => t.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {templates.filter(t => t.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {templates.filter(t => t.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      template.status === "completed" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                      template.status === "active" ? "bg-blue-100 dark:bg-blue-900/30" :
                      "bg-amber-100 dark:bg-amber-900/30"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        template.status === "completed" ? "text-emerald-600 dark:text-emerald-400" :
                        template.status === "active" ? "text-blue-600 dark:text-blue-400" :
                        "text-amber-600 dark:text-amber-400"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            template.status === "completed" ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300" :
                            template.status === "active" ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300" :
                            "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300"
                          )}
                        >
                          {template.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{template.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{template.progress}%</span>
                  </div>
                  <Progress value={template.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{template.responses} responses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{template.createdAt}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 gap-2"
                  size="sm"
                >
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
