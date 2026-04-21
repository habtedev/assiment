"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MoreVertical,
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
    deadline: null,
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
    deadline: null,
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
    deadline: "3 days",
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
    deadline: null,
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
    deadline: null,
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
    deadline: "5 days",
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
    deadline: null,
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
    deadline: null,
    icon: FileText
  },
];

export default function TemplateList() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dayCount, setDayCount] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [templatesData, setTemplatesData] = useState(templates);
  const [countdowns, setCountdowns] = useState<{ [key: number]: { days: number; hours: number; minutes: number; seconds: number } }>({});
  const [deadlineSetTimes, setDeadlineSetTimes] = useState<{ [key: number]: Date }>(() => {
    const initialTimes: { [key: number]: Date } = {};
    templates.filter(t => t.deadline).forEach(t => {
      initialTimes[t.id] = new Date(); // Set to now for existing deadlines
    });
    return initialTimes;
  });

  // Calculate countdown for each template with deadline
  React.useEffect(() => {
    const templatesWithDeadlines = templatesData.filter(t => t.deadline);
    if (templatesWithDeadlines.length === 0) {
      setCountdowns({});
      return;
    }

    const calculateCountdowns = () => {
      const now = new Date();
      const newCountdowns: { [key: number]: { days: number; hours: number; minutes: number; seconds: number } } = {};

      templatesWithDeadlines.forEach(template => {
        const days = parseInt(template.deadline?.split(" ")[0] || "0");
        // Get or create the deadline set time
        const setTime = deadlineSetTimes[template.id] || new Date();

        const deadlineDate = new Date(setTime.getTime() + days * 24 * 60 * 60 * 1000);
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff > 0) {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);

          newCountdowns[template.id] = { days: d, hours: h, minutes: m, seconds: s };
        }
      });

      setCountdowns(newCountdowns);
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [templatesData, deadlineSetTimes]);

  const handleSetTime = (template: any) => {
    setSelectedTemplate(template);
    if (template.deadline) {
      const parts = template.deadline.split(" ");
      setDayCount(parts[0] || "");
      setTimeValue(template.deadline.includes("at") ? parts[parts.length - 1] : "");
    } else {
      setDayCount("");
      setTimeValue("");
    }
    setIsDialogOpen(true);
  };

  const handleSaveTime = () => {
    if (selectedTemplate && dayCount) {
      const updatedTemplates = templatesData.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, deadline: `${dayCount} days${timeValue ? ` at ${timeValue}` : ""}` }
          : t
      );
      setTemplatesData(updatedTemplates);
      // Record when the deadline was set
      setDeadlineSetTimes(prev => ({
        ...prev,
        [selectedTemplate.id]: new Date()
      }));
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Templates</h2>
          <p className="text-muted-foreground">Manage department templates</p>
        </div>
      </div>

      {/* Countdown Timers */}
      {Object.keys(countdowns).length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-900/30 dark:to-rose-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Template Deadline Countdowns</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Time remaining for each template deadline</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templatesData.filter(t => t.deadline && countdowns[t.id]).map(template => (
              <div key={template.id} className="bg-white dark:bg-black rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <div className="font-medium text-sm text-amber-900 dark:text-amber-100 mb-2">{template.title}</div>
                <div className="flex gap-2 text-center">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdowns[template.id].days}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Days</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdowns[template.id].hours}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Hours</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdowns[template.id].minutes}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Min</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdowns[template.id].seconds}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Sec</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{templatesData.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {templatesData.filter(t => t.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {templatesData.filter(t => t.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {templatesData.filter(t => t.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templatesData.map((template) => {
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleSetTime(template)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                {/* Timeline Display */}
                {template.deadline && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{template.deadline}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${template.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Created: {template.createdAt}</span>
                      <span className="text-muted-foreground">{template.progress}% complete</span>
                    </div>
                  </div>
                )}

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

      {/* Time Setting Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Time for {selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="days">Duration (Days)</Label>
              <Select value={dayCount} onValueChange={setDayCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="4">4 Days</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="10">10 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTime}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
