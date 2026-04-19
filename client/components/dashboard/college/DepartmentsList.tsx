"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Mail,
  Phone,
  MoreVertical,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function DepartmentsList() {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/departments`, {
        credentials: "include",
      });
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast({
          title: "Department Deleted",
          description: "The department has been removed successfully.",
        });
        fetchDepartments();
      } else {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete department",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const name = typeof dept.name === "string" ? dept.name : (dept.name?.en || dept.name?.am || "");
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (dept.code?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/college")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Departments
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage all departments in your college
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/college/departments/new")}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-4 py-2 text-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-indigo-50 dark:bg-black border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-white" />
              <div>
                <p className="text-2xl font-bold text-indigo-700 dark:text-white">{departments.length}</p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Total Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-black border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-white" />
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-white">
                  {departments.reduce((sum, d) => sum + (d.students?.length || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-black border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-white" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-white">
                  {departments.reduce((sum, d) => sum + (d.assessments?.length || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search departments by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 rounded-full"
        />
      </div>

      {/* Departments Grid */}
      {loading ? (
        <Card className="border-0 bg-indigo-50 dark:bg-black">
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 dark:text-indigo-400" />
          </CardContent>
        </Card>
      ) : filteredDepartments.length === 0 ? (
        <Card className="border-0 bg-indigo-50 dark:bg-black">
          <CardContent className="py-16 text-center">
            <Building2 className="h-16 w-16 mx-auto text-indigo-500/30 dark:text-indigo-400/30 mb-4" />
            <p className="text-muted-foreground dark:text-gray-400 font-medium">No departments found</p>
            <p className="text-sm text-muted-foreground/60 dark:text-gray-500 mt-1">
              {searchTerm ? "Try a different search term" : "Add your first department to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDepartments.map((dept) => (
            <Card
              key={dept.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/95 dark:bg-black backdrop-blur-xl"
            >
              <CardHeader className="pb-3 px-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer">
                      <CardTitle className="text-sm font-semibold truncate">
                        {typeof dept.name === "string"
                          ? dept.name
                          : (dept.name?.en || dept.name?.am || "")}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{dept.code}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-800 cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-rose-600 dark:text-rose-400 cursor-pointer"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {dept.headName && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3 w-3 text-indigo-600" />
                      <span className="text-xs truncate">Head: {dept.headName}</span>
                    </div>
                  )}
                  {dept.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3 text-indigo-600" />
                      <span className="text-xs truncate">{dept.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium">{dept.students?.length || 0}</span>
                      <span className="text-[10px] text-muted-foreground">students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium">{dept.assessments?.length || 0}</span>
                      <span className="text-[10px] text-muted-foreground">assessments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
