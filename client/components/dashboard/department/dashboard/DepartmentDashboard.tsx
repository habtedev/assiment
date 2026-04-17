"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Award,
  BookOpen,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const stats = {
  totalStudents: 1250,
  completedTemplates: 980,
  incompleteTemplates: 270,
  satisfactionRate: 87,
  dissatisfactionRate: 13,
};

const teachers = [
  { name: "Dr. Abebe Kebede", satisfaction: 95, dissatisfaction: 5, students: 145 },
  { name: "Prof. Almaz Bekele", satisfaction: 92, dissatisfaction: 8, students: 132 },
  { name: "Dr. Solomon Tesfaye", satisfaction: 88, dissatisfaction: 12, students: 118 },
  { name: "Mrs. Tirunesh Dinku", satisfaction: 85, dissatisfaction: 15, students: 98 },
  { name: "Mr. Kifle Mekonnen", satisfaction: 82, dissatisfaction: 18, students: 87 },
];

export default function DepartmentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const completionPercentage = Math.round((stats.completedTemplates / stats.totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Department Overview</h2>
          <p className="text-muted-foreground">Real-time statistics and analytics</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          Live Data
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalStudents.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Completed Templates */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              {stats.completedTemplates}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {completionPercentage}% completion rate
            </div>
          </CardContent>
        </Card>

        {/* Incomplete Templates */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Incomplete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              {stats.incompleteTemplates}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {100 - completionPercentage}% pending
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Rate */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {stats.satisfactionRate}%
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {stats.dissatisfactionRate}% dissatisfaction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Template Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold text-emerald-600">{stats.completedTemplates}</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Incomplete</span>
                <span className="font-semibold text-amber-600">{stats.incompleteTemplates}</span>
              </div>
              <Progress value={100 - completionPercentage} className="h-3" />
            </div>

            {/* Visual Bar Chart */}
            <div className="mt-6 flex items-end gap-4 h-32">
              <div className="flex-1 bg-emerald-500 rounded-t-lg" style={{ height: `${completionPercentage}%` }}>
                <div className="text-center text-xs text-white font-medium mt-2">
                  {completionPercentage}%
                </div>
              </div>
              <div className="flex-1 bg-amber-500 rounded-t-lg" style={{ height: `${100 - completionPercentage}%` }}>
                <div className="text-center text-xs text-white font-medium mt-2">
                  {100 - completionPercentage}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Student Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-emerald-500" />
                  Satisfied
                </span>
                <span className="font-semibold text-emerald-600">{stats.satisfactionRate}%</span>
              </div>
              <Progress value={stats.satisfactionRate} className="h-3" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-rose-500" />
                  Dissatisfied
                </span>
                <span className="font-semibold text-rose-600">{stats.dissatisfactionRate}%</span>
              </div>
              <Progress value={stats.dissatisfactionRate} className="h-3" />
            </div>

            {/* Visual Pie Chart */}
            <div className="mt-6 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div 
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #10b981 0% ${stats.satisfactionRate}%, 
                      #f43f5e ${stats.satisfactionRate}% 100%
                    )`
                  }}
                />
                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.satisfactionRate}%</div>
                    <div className="text-xs text-muted-foreground">Satisfied</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Teachers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            Top Teachers by Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher, index) => (
              <div 
                key={teacher.name}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all",
                  index === 0 && "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800",
                  index > 0 && "hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {/* Rank */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  index === 0 ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}>
                  {index + 1}
                </div>

                {/* Teacher Info */}
                <div className="flex-1">
                  <div className="font-medium">{teacher.name}</div>
                  <div className="text-sm text-muted-foreground">{teacher.students} students</div>
                </div>

                {/* Satisfaction Bar */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${teacher.satisfaction}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{teacher.satisfaction}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                      <div 
                        className="bg-rose-500 h-1 rounded-full transition-all"
                        style={{ width: `${teacher.dissatisfaction}%` }}
                      />
                    </div>
                    <span className="text-xs text-rose-600">{teacher.dissatisfaction}%</span>
                  </div>
                </div>

                {/* Badge */}
                {index === 0 && (
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    Best Teacher
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
