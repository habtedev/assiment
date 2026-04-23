"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UserCheck,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [formData, setFormData] = useState({
    year: "",
    section: "",
    teacherId: "",
  });

  const [courseTeacherPairs, setCourseTeacherPairs] = useState<Array<{ courseId: string; teacherId: string }>>([]);

  const statuses = ["All Status", "active", "pending", "dropped"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        const [enrollmentsRes, teachersRes, coursesRes] = await Promise.all([
          fetch("http://localhost:8500/api/enrollments", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("http://localhost:8500/api/teachers", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("http://localhost:8500/api/courses", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (enrollmentsRes.ok) setEnrollments(await enrollmentsRes.json());
        if (teachersRes.ok) setTeachers(await teachersRes.json());
        if (coursesRes.ok) setCourses(await coursesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch sections when year changes
  useEffect(() => {
    const fetchSections = async () => {
      if (formData.year) {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await fetch(`http://localhost:8500/api/students/sections?year=${formData.year}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (response.ok) {
            const data = await response.json();
            setSections(data);
          }
        } catch (error) {
          console.error("Error fetching sections:", error);
        }
      } else {
        setSections([]);
      }
    };

    fetchSections();
  }, [formData.year]);

  // Fetch teachers when year and section are selected
  useEffect(() => {
    const fetchTeachers = async () => {
      if (formData.year && formData.section) {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await fetch(`http://localhost:8500/api/students/teachers/all`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (response.ok) {
            const data = await response.json();
            setFilteredTeachers(data);
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
      } else {
        setFilteredTeachers([]);
      }
    };

    fetchTeachers();
  }, [formData.year, formData.section]);

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch =
      enrollment.course?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.year?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.section?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || enrollment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedStatus("All Status");
    setSearchTerm("");
  };

  const handleAddEnrollment = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      // Use the teacherId from main form if selected, otherwise use from course-teacher pairs
      const teacherId = formData.teacherId || courseTeacherPairs[0]?.teacherId;

      if (!teacherId) {
        console.error("No teacher selected");
        return;
      }

      // Create enrollments for each course
      const enrollmentPromises = courseTeacherPairs.map(pair =>
        fetch("http://localhost:8500/api/enrollments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            courseId: pair.courseId,
            teacherId: teacherId,
            year: formData.year,
            section: formData.section,
          }),
        })
      );

      const responses = await Promise.all(enrollmentPromises);

      if (responses.every(r => r.ok)) {
        // Refresh enrollments
        const enrollmentsRes = await fetch("http://localhost:8500/api/enrollments", {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (enrollmentsRes.ok) setEnrollments(await enrollmentsRes.json());

        setShowAddForm(false);
        setFormData({ year: "", section: "", teacherId: "" });
        setCourseTeacherPairs([]);
      }
    } catch (error) {
      console.error("Error adding enrollment:", error);
    }
  };

  const addCourseTeacherPair = () => {
    setCourseTeacherPairs([...courseTeacherPairs, { courseId: "", teacherId: "" }]);
  };

  const removeCourseTeacherPair = (index: number) => {
    setCourseTeacherPairs(courseTeacherPairs.filter((_, i) => i !== index));
  };

  const updateCourseTeacherPair = (index: number, field: 'courseId' | 'teacherId', value: string) => {
    const updated = [...courseTeacherPairs];
    updated[index][field] = value;
    setCourseTeacherPairs(updated);
  };

  // Auto-fill teacher in course-teacher pairs when teacher is selected in main form
  useEffect(() => {
    if (formData.teacherId && courseTeacherPairs.length > 0) {
      const updated = courseTeacherPairs.map(pair => ({
        ...pair,
        teacherId: formData.teacherId,
      }));
      setCourseTeacherPairs(updated);
    }
  }, [formData.teacherId]);

  const getTeacherDisplayName = (teacher: any) => {
    if (teacher.title) {
      return `${teacher.title} ${teacher.name}`;
    }
    return teacher.name;
  };

  const activeFiltersCount = [
    selectedStatus !== "All Status",
    searchTerm !== ""
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enrollments</h2>
          <p className="text-muted-foreground">Manage student course enrollments</p>
        </div>
        <Button className="gap-2 cursor-pointer" onClick={() => { setShowAddForm(true); setCourseTeacherPairs([{ courseId: "", teacherId: "" }]); }}>
          <Plus className="h-4 w-4" />
          New Enrollment
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{enrollments.length}</div>
            )}
            <div className="text-sm text-muted-foreground">Total Enrollments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {enrollments.filter(e => e.status === "active").length}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {enrollments.filter(e => e.status === "pending").length}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {enrollments.filter(e => e.status === "dropped").length}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Dropped</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Enrollment Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add New Enrollment</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value, section: "", teacherId: "" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value, teacherId: "" })} disabled={!formData.year}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.year ? "Select section" : "Select year first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })} disabled={!formData.year || !formData.section}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.year && formData.section ? "Select teacher" : "Select year and section first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeachers.map(teacher => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>{getTeacherDisplayName(teacher)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Courses</h3>
                  <Button variant="outline" size="sm" onClick={addCourseTeacherPair} className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>

                {courseTeacherPairs.map((pair, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-rose-600 hover:text-rose-700 cursor-pointer"
                      onClick={() => removeCourseTeacherPair(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor={`course-${index}`}>Course</Label>
                      <Select value={pair.courseId} onValueChange={(value) => updateCourseTeacherPair(index, 'courseId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={String(course.id)}>{course.code} - {course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {courseTeacherPairs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No courses added yet. Click "Add Course" to add a course.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEnrollment} className="flex-1" disabled={courseTeacherPairs.length === 0 || !formData.teacherId}>
                  Add Enrollment(s)
                </Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); setFormData({ year: "", section: "", teacherId: "" }); setCourseTeacherPairs([]); }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by course, teacher, year, or section..."
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
          Filter
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
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {loading ? 'Loading...' : `Showing ${filteredEnrollments.length} of ${enrollments.length} enrollments`}
      </div>

      {/* Enrollments Table */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading enrollments...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Course</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Teacher</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Year</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Section</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{enrollment.course?.code}</div>
                            <div className="text-xs text-muted-foreground">{enrollment.course?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">{getTeacherDisplayName(enrollment.teacher)}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{enrollment.year}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{enrollment.section}</div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            enrollment.status === "active" ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300" :
                            enrollment.status === "pending" ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300" :
                            "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                          )}
                        >
                          {enrollment.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && filteredEnrollments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No enrollments found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
