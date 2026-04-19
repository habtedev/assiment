"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  PlusCircle,
  Users,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function CollegeDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate analytics
  const totalDepartments = departments.length;
  const totalStudents = departments.reduce((sum, d) => sum + (d.students?.length || 0), 0);
  const totalTeachers = departments.reduce((sum, d) => sum + (d.teachers?.length || 0), 0);

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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your college departments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDepartments}</p>
                <p className="text-sm text-muted-foreground">Total Departments</p>
              </div>
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTeachers}</p>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : departments.length === 0 ? (
        <Card className="border">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first department</p>
            <Button
              onClick={() => router.push("/dashboard/college/departments/new")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 mr-2 " />
              Add Department
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/college/departments/${dept.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {typeof dept.name === "string" ? dept.name : (dept.name?.en || dept.name?.am || "Unknown")}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{dept.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    <span>{dept.teachers?.length || 0} Teachers</span>
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
