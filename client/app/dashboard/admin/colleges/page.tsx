"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  MapPin,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function CollegesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/colleges`, {
        credentials: "include",
      });
      const data = await res.json();
      setColleges(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load colleges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/colleges/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (res.ok) {
        toast({
          title: "College Deleted",
          description: "The college has been removed successfully.",
        });
        fetchColleges();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete college",
        variant: "destructive",
      });
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.name?.am?.includes(searchTerm) ||
    college.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
              Colleges
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all colleges in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin/colleges/new")}
            className="bg-gradient-to-r from-amber-500 to-rose-500 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Colleges Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredColleges.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No colleges found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {typeof college.name === "object"
                            ? college.name?.en || college.name?.am || ""
                            : college.name || ""}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{college.code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/colleges/${college.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-rose-600"
                          onClick={() => handleDelete(college.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {college.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="text-xs">{college.email}</span>
                      </div>
                    )}
                    {college.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span className="text-xs">{college.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs">{college.studentCount || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span className="text-xs">{college.departmentCount || 0} depts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}