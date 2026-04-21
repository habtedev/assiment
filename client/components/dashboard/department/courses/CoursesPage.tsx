"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  User,
  GraduationCap,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [departments, setDepartments] = useState<string[]>(["All Departments"]);
  const statuses = ["All Status", "active", "pending", "inactive"];

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch("http://localhost:8500/api/courses", {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          // Extract unique departments
          const uniqueDepts = [...new Set(data.map((c: any) => c.department?.name).filter(Boolean))] as string[];
          if (uniqueDepts.length > 0) {
            setDepartments(prev => [...prev, ...uniqueDepts]);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = selectedDepartment === "All Departments" || course.department?.name === selectedDepartment;
    const matchesStatus = selectedStatus === "All Status" || course.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedDepartment("All Departments");
    setSelectedStatus("All Status");
    setSearchTerm("");
  };

  const activeFiltersCount = [
    selectedDepartment !== "All Departments",
    selectedStatus !== "All Status",
    searchTerm !== ""
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">Manage department courses and schedules</p>
        </div>
        <Button
          className="gap-2 cursor-pointer"
          onClick={() => router.push("/dashboard/department/courses/new")}
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{courses.length}</div>
            )}
            <div className="text-sm text-muted-foreground">Total Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {courses.filter(c => c.status === "active").length}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {courses.reduce((acc, c) => acc + (c.credits || 0), 0)}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Credits</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Advanced Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses by name, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 focus:ring-gray-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {}}
            className={cn("cursor-pointer", activeFiltersCount > 0 && "bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white">{activeFiltersCount}</Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="cursor-pointer">
              Clear
            </Button>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <div className="relative">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500 pr-8 dark:bg-black dark:border-gray-800"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500 pr-8 dark:bg-black dark:border-gray-800"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {loading ? 'Loading...' : `Showing ${filteredCourses.length} of ${courses.length} courses`}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading courses...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{course.code}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1",
                          course.status === "active" ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300" :
                          course.status === "pending" ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300" :
                          "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                        )}
                      >
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">{course.name}</h3>
                    <p className="text-xs text-muted-foreground">{course.department?.name || 'No Department'}</p>
                  </div>
                  {course.instructor && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.instructor}</span>
                    </div>
                  )}
                  {course.hours && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Hours</span>
                      </div>
                      <span className="font-semibold">{course.hours}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Credits</span>
                    </div>
                    <span className="font-semibold">{course.credits}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 cursor-pointer">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2 text-rose-600 hover:text-rose-700 cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
