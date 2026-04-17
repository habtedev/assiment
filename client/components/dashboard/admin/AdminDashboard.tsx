"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  BarChart3,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  GraduationCap,
  Award,
  BookOpen,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data for charts
const monthlyData = [
  { name: "Jan", templates: 4, assessments: 24, colleges: 8 },
  { name: "Feb", templates: 7, assessments: 32, colleges: 8 },
  { name: "Mar", templates: 9, assessments: 45, colleges: 9 },
  { name: "Apr", templates: 12, assessments: 58, colleges: 9 },
  { name: "May", templates: 15, assessments: 72, colleges: 10 },
  { name: "Jun", templates: 18, assessments: 89, colleges: 10 },
  { name: "Jul", templates: 22, assessments: 105, colleges: 11 },
  { name: "Aug", templates: 24, assessments: 124, colleges: 11 },
  { name: "Sep", templates: 24, assessments: 156, colleges: 12 },
  { name: "Oct", templates: 24, assessments: 189, colleges: 12 },
  { name: "Nov", templates: 24, assessments: 223, colleges: 12 },
  { name: "Dec", templates: 24, assessments: 267, colleges: 12 },
];

const questionTypeDistribution = [
  { name: "Multiple Choice", value: 45, color: "#6366f1" },
  { name: "Paragraph", value: 25, color: "#8b5cf6" },
  { name: "Rating", value: 18, color: "#10b981" },
  { name: "Short Text", value: 12, color: "#f59e0b" },
];

const analytics = [
  {
    label: "Total Users",
    value: 1248,
    icon: Users,
    trend: "+12%",
    trendUp: true,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    label: "Total Colleges",
    value: 12,
    icon: Building2,
    trend: "+2",
    trendUp: true,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    label: "Assessments",
    value: 345,
    icon: BarChart3,
    trend: "+28%",
    trendUp: true,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    label: "Templates",
    value: 24,
    icon: FileText,
    trend: "+5",
    trendUp: true,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-gray-200 dark:border-gray-700">
              v3.0.0
            </Badge>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {analytics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </CardTitle>
                  <div className={cn("p-1.5 rounded-lg", item.bgColor)}>
                    <Icon className={cn("h-3.5 w-3.5", item.iconColor)} />
                  </div>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn(
                      "rounded-full text-xs",
                      item.trendUp ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      <TrendingUp className={cn(
                        "h-3 w-3 mr-1",
                        !item.trendUp && "rotate-180"
                      )} />
                      {item.trend}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Growth Chart */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <div>
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Platform Growth
                </CardTitle>
                <CardDescription className="text-xs">Monthly activity overview</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTemplates" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="assessments"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorAssessments)"
                      name="Assessments"
                    />
                    <Area
                      type="monotone"
                      dataKey="templates"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorTemplates)"
                      name="Templates"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Question Type Distribution */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-600" />
                Question Types
              </CardTitle>
              <CardDescription className="text-xs">Distribution across templates</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={questionTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {questionTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {questionTypeDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid md:grid-cols-4 gap-3">
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8,452</p>
                </div>
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>↑ 12%</span>
                <span>from last semester</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">486</p>
                </div>
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>↑ 8%</span>
                <span>new this year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Assessments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,284</p>
                </div>
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>↑ 23%</span>
                <span>completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
                </div>
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>↑ 5%</span>
                <span>vs last year</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <div>
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs">Latest actions across the platform</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Show all</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Filter by type</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Export log</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="space-y-3">
              {[
                {
                  icon: "📝",
                  title: "New template created",
                  description: "Semester I Teacher Evaluation",
                  time: "2 minutes ago",
                  type: "template",
                  status: "success"
                },
                {
                  icon: "👤",
                  title: "Question added to bank",
                  description: "Added 5 new multiple choice questions",
                  time: "1 hour ago",
                  type: "question",
                  status: "info"
                },
                {
                  icon: "🏛️",
                  title: "College registered",
                  description: "College of Health Sciences",
                  time: "3 hours ago",
                  type: "college",
                  status: "success"
                },
                {
                  icon: "📊",
                  title: "Assessment completed",
                  description: "345 responses collected",
                  time: "5 hours ago",
                  type: "assessment",
                  status: "warning"
                }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">{activity.title}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[10px] h-5",
                          activity.status === "success" && "bg-green-50 text-green-700 border-green-200",
                          activity.status === "info" && "bg-blue-50 text-blue-700 border-blue-200",
                          activity.status === "warning" && "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3 px-4 pb-4">
            <Button variant="ghost" className="w-full rounded-lg text-xs h-8">
              View all activity
              <ChevronRight className="h-3.5 w-3.5 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}