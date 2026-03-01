"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Users, 
  Building2, 
  FileText,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AdminHeader } from "@/components/dashboard/admin/layouts/Header";

// ✅ FIXED: These are the correct imports - all from the features folder
import TemplateList from "@/features/template-builder/TemplateList";
import AddCollegeForm from "@/features/template-builder/AddCollegeForm";
import QuestionBank from "@/features/template-builder/QuestionBank";
// If TemplateForm exists, import it too, otherwise remove this line
// import TemplateForm from "@/features/template-builder/TemplateForm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ... rest of your code remains exactly the same ...

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

const collegePerformance = [
  { name: "Informatics", students: 1240, teachers: 85, satisfaction: 92 },
  { name: "Medicine", students: 2150, teachers: 142, satisfaction: 88 },
  { name: "Business", students: 980, teachers: 62, satisfaction: 94 },
  { name: "Engineering", students: 1650, teachers: 98, satisfaction: 86 },
  { name: "Law", students: 720, teachers: 45, satisfaction: 91 },
  { name: "Education", students: 890, teachers: 54, satisfaction: 89 },
];

const questionTypeDistribution = [
  { name: "Multiple Choice", value: 45, color: "#f59e0b" },
  { name: "Paragraph", value: 25, color: "#10b981" },
  { name: "Rating", value: 18, color: "#3b82f6" },
  { name: "Short Text", value: 12, color: "#8b5cf6" },
];

const weeklyActivity = [
  { day: "Mon", responses: 45, templates: 3 },
  { day: "Tue", responses: 62, templates: 5 },
  { day: "Wed", responses: 78, templates: 7 },
  { day: "Thu", responses: 81, templates: 6 },
  { day: "Fri", responses: 54, templates: 4 },
  { day: "Sat", responses: 23, templates: 1 },
  { day: "Sun", responses: 12, templates: 0 },
];

const analytics = [
  { 
    label: "Total Users", 
    value: 1248, 
    icon: Users, 
    trend: "+12%", 
    trendUp: true,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  { 
    label: "Total Colleges", 
    value: 12, 
    icon: Building2, 
    trend: "+2", 
    trendUp: true,
    color: "from-amber-500 to-rose-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  { 
    label: "Assessments", 
    value: 345, 
    icon: BarChart3, 
    trend: "+28%", 
    trendUp: true,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400"
  },
  { 
    label: "Templates", 
    value: 24, 
    icon: FileText, 
    trend: "+5", 
    trendUp: true,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "templates" | "questions" | "colleges" | "analytics">("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "year">("month");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <AdminHeader onMenuClick={() => {}} isSidebarOpen={false} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Section with Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-50 to-rose-50 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1 text-amber-600" />
                Admin Dashboard
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                +28% this month
              </Badge>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
              Welcome back, Administrator
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              Last login: Today at 9:42 AM
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              v3.0.0
            </Badge>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {analytics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                  <div className={cn("p-2 rounded-lg", item.bgColor)}>
                    <Icon className={cn("h-4 w-4", item.iconColor)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn(
                      "rounded-full",
                      item.trendUp ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                    )}>
                      <TrendingUp className={cn(
                        "h-3 w-3 mr-1",
                        !item.trendUp && "rotate-180"
                      )} />
                      {item.trend}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth Chart - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Platform Growth
                </CardTitle>
                <CardDescription>Monthly activity overview</CardDescription>
              </div>
              <div className="flex gap-1">
                {["week", "month", "year"].map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range as any)}
                    className={cn(
                      "rounded-full text-xs capitalize",
                      selectedTimeRange === range && "bg-gradient-to-r from-amber-500 to-rose-500 text-white"
                    )}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTemplates" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="assessments" 
                      stroke="#f59e0b" 
                      fillOpacity={1} 
                      fill="url(#colorAssessments)" 
                      name="Assessments"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="templates" 
                      stroke="#10b981" 
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
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-amber-600" />
                Question Types
              </CardTitle>
              <CardDescription>Distribution across templates</CardDescription>
            </CardHeader>
            <CardContent>
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
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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

        {/* Second Row - More Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* College Performance Chart */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-600" />
                College Performance
              </CardTitle>
              <CardDescription>Student satisfaction by college</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collegePerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                    <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="satisfaction" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                      {collegePerformance.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${30 + index * 10}, 85%, 55%)`} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Responses and templates this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responses" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#f59e0b" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="templates" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10b981" }}
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 bg-gradient-to-br from-amber-500 to-rose-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Students</p>
                  <p className="text-3xl font-bold">8,452</p>
                </div>
                <GraduationCap className="h-8 w-8 opacity-75" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                <span>↑ 12%</span>
                <span>from last semester</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Teachers</p>
                  <p className="text-3xl font-bold">486</p>
                </div>
                <Users className="h-8 w-8 opacity-75" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                <span>↑ 8%</span>
                <span>new this year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Assessments</p>
                  <p className="text-3xl font-bold">1,284</p>
                </div>
                <BookOpen className="h-8 w-8 opacity-75" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                <span>↑ 23%</span>
                <span>completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Avg. Satisfaction</p>
                  <p className="text-3xl font-bold">89%</p>
                </div>
                <Award className="h-8 w-8 opacity-75" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                <span>↑ 5%</span>
                <span>vs last year</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity with Actions */}
        <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Show all</DropdownMenuItem>
                <DropdownMenuItem>Filter by type</DropdownMenuItem>
                <DropdownMenuItem>Export log</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                },
                { 
                  icon: "⭐", 
                  title: "New rating submitted", 
                  description: "Average rating: 4.8/5.0",
                  time: "6 hours ago",
                  type: "rating",
                  status: "info"
                }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-full text-[10px] h-5",
                          activity.status === "success" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          activity.status === "info" && "bg-blue-50 text-blue-700 border-blue-200",
                          activity.status === "warning" && "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="ghost" className="w-full rounded-full text-sm">
              View all activity
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl max-w-3xl">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="colleges" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Colleges</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplateList />
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <QuestionBank />
          </TabsContent>

          {/* Colleges Tab */}
          <TabsContent value="colleges">
            <AddCollegeForm />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive platform metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    We're working on bringing you detailed analytics with custom reports, 
                    predictive insights, and advanced filtering options.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}