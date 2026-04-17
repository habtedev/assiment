"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Users,
  FileText,
  BookOpen,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Zap,
  Heart,
  Shield,
  BarChart3,
  Activity,
  Star,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
  userName?: string;
  userAvatar?: string;
  compact?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName = "Abebe Kebede",
  userAvatar,
  compact = false,
}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      title: "Active Templates",
      value: "8",
      icon: FileText,
      color: "from-amber-500 to-rose-500",
      description: "Templates in progress",
    },
    {
      title: "Completed",
      value: "12",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
      description: "Successfully finished",
    },
    {
      title: "Pending",
      value: "4",
      icon: AlertCircle,
      color: "from-rose-500 to-orange-500",
      description: "Awaiting completion",
    },
      ];

  const recentActivity = [
    {
      id: 1,
      title: "Midterm Assessment",
      type: "assessment",
      status: "completed",
      score: 92,
      time: "2 hours ago",
      icon: FileText,
    },
    {
      id: 2,
      title: "Data Structures Course",
      type: "course",
      status: "in-progress",
      progress: 75,
      time: "5 hours ago",
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Lab Assessment",
      type: "assessment",
      status: "submitted",
      time: "1 day ago",
      icon: FileText,
    },
    {
      id: 4,
      title: "Web Development",
      type: "course",
      status: "in-progress",
      progress: 60,
      time: "2 days ago",
      icon: BookOpen,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Final Project",
      dueDate: "2024-04-20",
      daysLeft: 5,
      priority: "high",
      type: "project",
    },
    {
      id: 2,
      title: "Lab Assessment",
      dueDate: "2024-04-18",
      daysLeft: 3,
      priority: "medium",
      type: "assessment",
    },
    {
      id: 3,
      title: "Web Development",
      dueDate: "2024-04-25",
      daysLeft: 10,
      priority: "low",
      type: "course",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "text-rose-600 dark:text-rose-400";
    if (daysLeft <= 7) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-amber-500/30">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={cn(
                  "p-2 rounded-lg",
                  `bg-gradient-to-br ${stat.color}`
                )}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-amber-200/50 dark:border-amber-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest assessment and course activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    activity.type === "assessment" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-purple-100 dark:bg-purple-900/30"
                  )}>
                    <activity.icon className={cn(
                      "h-4 w-4",
                      activity.type === "assessment" ? "text-amber-600 dark:text-amber-400" : "text-purple-600 dark:text-purple-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      {activity.status === "completed" && activity.score && (
                        <Badge className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Score: {activity.score}%
                        </Badge>
                      )}
                      {activity.status === "in-progress" && activity.progress && (
                        <div className="flex items-center gap-2 flex-1">
                          <Progress value={activity.progress} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground">{activity.progress}%</span>
                        </div>
                      )}
                      {activity.status === "submitted" && (
                        <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-amber-200/50 dark:border-amber-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-rose-600" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Assignments that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-3 rounded-lg border border-amber-200/50 dark:border-amber-800/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge className={cn("text-xs", getPriorityColor(deadline.priority))}>
                      {deadline.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: {deadline.dueDate}</span>
                    </div>
                    <span className={cn("font-medium", getDaysLeftColor(deadline.daysLeft))}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="backdrop-blur-xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border-amber-200/50 dark:border-amber-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                  Ready to continue learning?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off or start something new.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
