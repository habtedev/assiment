"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus,
  GraduationCap,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for students with more realistic fields
const students = [
  { id: 1, name: "Abebe Bekele", email: "abebe.b@uog.edu.et", phone: "+251911123456", gpa: 3.8, status: "active", year: "1st Year", department: "Computer Science", enrollmentDate: "2023-09-01" },
  { id: 2, name: "Almaz Tesfaye", email: "almaz.t@uog.edu.et", phone: "+251911234567", gpa: 3.5, status: "active", year: "1st Year", department: "Computer Science", enrollmentDate: "2023-09-01" },
  { id: 3, name: "Solomon Dinku", email: "solomon.d@uog.edu.et", phone: "+251911345678", gpa: 3.2, status: "pending", year: "1st Year", department: "Information Systems", enrollmentDate: "2023-09-15" },
  { id: 4, name: "Tirunesh Mekonnen", email: "tirunesh.m@uog.edu.et", phone: "+251911456789", gpa: 3.9, status: "active", year: "2nd Year", department: "Computer Science", enrollmentDate: "2022-09-01" },
  { id: 5, name: "Kifle Abebe", email: "kifle.a@uog.edu.et", phone: "+251911567890", gpa: 3.4, status: "active", year: "2nd Year", department: "Information Systems", enrollmentDate: "2022-09-01" },
  { id: 6, name: "Dawit Kebede", email: "dawit.k@uog.edu.et", phone: "+251911678901", gpa: 3.1, status: "inactive", year: "2nd Year", department: "Software Engineering", enrollmentDate: "2022-09-10" },
  { id: 7, name: "Meron Solomon", email: "meron.s@uog.edu.et", phone: "+251911789012", gpa: 3.7, status: "active", year: "3rd Year", department: "Computer Science", enrollmentDate: "2021-09-01" },
  { id: 8, name: "Bethelhem Tesfaye", email: "bethelhem.t@uog.edu.et", phone: "+251911890123", gpa: 3.6, status: "active", year: "3rd Year", department: "Information Systems", enrollmentDate: "2021-09-05" },
  { id: 9, name: "Yonas Bekele", email: "yonas.b@uog.edu.et", phone: "+251911901234", gpa: 3.3, status: "pending", year: "3rd Year", department: "Software Engineering", enrollmentDate: "2021-09-15" },
  { id: 10, name: "Hana Mekonnen", email: "hana.m@uog.edu.et", phone: "+251912012345", gpa: 3.8, status: "active", year: "4th Year", department: "Computer Science", enrollmentDate: "2020-09-01" },
  { id: 11, name: "Michael Abebe", email: "michael.a@uog.edu.et", phone: "+251912123456", gpa: 3.5, status: "active", year: "4th Year", department: "Information Systems", enrollmentDate: "2020-09-01" },
  { id: 12, name: "Sara Tesfaye", email: "sara.t@uog.edu.et", phone: "+251912234567", gpa: 3.9, status: "active", year: "4th Year", department: "Software Engineering", enrollmentDate: "2020-09-10" },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);

  const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const statuses = ["All Status", "active", "pending", "inactive"];

  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    // Year filter
    const matchesYear = selectedYear === "All Years" || student.year === selectedYear;

    // Status filter
    const matchesStatus = selectedStatus === "All Status" || student.status === selectedStatus;

    return matchesSearch && matchesYear && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedYear("All Years");
    setSelectedStatus("All Status");
    setSearchTerm("");
  };

  const activeFiltersCount = [
    selectedYear !== "All Years",
    selectedStatus !== "All Status",
    searchTerm !== ""
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground">Manage student accounts with advanced filters</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{students.length}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {students.filter(s => s.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {students.filter(s => s.status !== "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Incompleted</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Advanced Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-blue-50 border-blue-300")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-blue-500 text-white">{activeFiltersCount}</Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academic Year</label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedYear !== "All Years" && (
            <Badge variant="secondary" className="gap-1">
              Year: {selectedYear}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedYear("All Years")} />
            </Badge>
          )}
          {selectedStatus !== "All Status" && (
            <Badge variant="secondary" className="gap-1">
              Status: {selectedStatus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStatus("All Status")} />
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {student.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "mt-1",
                        student.status === "active" ? "border-emerald-200 text-emerald-700" :
                        student.status === "pending" ? "border-amber-200 text-amber-700" :
                        "border-slate-200 text-slate-700"
                      )}
                    >
                      {student.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{student.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Year</span>
                  </div>
                  <span className="font-semibold">{student.year}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dept</span>
                  </div>
                  <span className="font-semibold text-xs">{student.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">GPA</span>
                  </div>
                  <span className="font-semibold">{student.gpa.toFixed(1)}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2 text-rose-600 hover:text-rose-700">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students found matching your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
