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
  Award,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for teachers
const teachers = [
  { 
    id: 1, 
    name: "Dr. Abebe Kebede", 
    email: "abebe.k@uog.edu.et", 
    phone: "+251911123456", 
    department: "Computer Science",
    courses: 4,
    experience: "15 years",
    status: "active" 
  },
  { 
    id: 2, 
    name: "Prof. Almaz Bekele", 
    email: "almaz.b@uog.edu.et", 
    phone: "+251911234567", 
    department: "Mathematics",
    courses: 3,
    experience: "20 years",
    status: "active" 
  },
  { 
    id: 3, 
    name: "Dr. Solomon Tesfaye", 
    email: "solomon.t@uog.edu.et", 
    phone: "+251911345678", 
    department: "Physics",
    courses: 5,
    experience: "12 years",
    status: "active" 
  },
  { 
    id: 4, 
    name: "Mrs. Tirunesh Dinku", 
    email: "tirunesh.d@uog.edu.et", 
    phone: "+251911456789", 
    department: "Chemistry",
    courses: 4,
    experience: "10 years",
    status: "pending" 
  },
  { 
    id: 5, 
    name: "Mr. Kifle Mekonnen", 
    email: "kifle.m@uog.edu.et", 
    phone: "+251911567890", 
    department: "Biology",
    courses: 3,
    experience: "8 years",
    status: "active" 
  },
  { 
    id: 6, 
    name: "Dr. Dawit Kebede", 
    email: "dawit.k@uog.edu.et", 
    phone: "+251911678901", 
    department: "Statistics",
    courses: 2,
    experience: "5 years",
    status: "inactive" 
  },
];

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Teachers</h2>
          <p className="text-muted-foreground">Manage teacher accounts and assignments</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{teachers.length}</div>
            <div className="text-sm text-muted-foreground">Total Teachers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {teachers.filter(t => t.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Teachers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {teachers.reduce((acc, t) => acc + t.courses, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {teachers.filter(t => t.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teachers by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {teacher.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <CardTitle className="text-base">{teacher.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "mt-1",
                        teacher.status === "active" ? "border-emerald-200 text-emerald-700" :
                        teacher.status === "pending" ? "border-amber-200 text-amber-700" :
                        "border-slate-200 text-slate-700"
                      )}
                    >
                      {teacher.status}
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
                  <span className="text-muted-foreground">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{teacher.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dept</span>
                  </div>
                  <span className="font-semibold">{teacher.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Courses</span>
                  </div>
                  <span className="font-semibold">{teacher.courses}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Experience</span>
                  </div>
                  <span className="font-semibold">{teacher.experience}</span>
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

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No teachers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
