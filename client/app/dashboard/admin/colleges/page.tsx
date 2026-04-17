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
  Loader2,
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
      } else {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete college",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete college. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredColleges = colleges.filter(college => {
    const name = typeof college.name === "object" 
      ? (college.name?.en || college.name?.am || "")
      : (college.name || "");
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (college.code?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
              Colleges
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage all colleges in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin/colleges/new")}
            className="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full px-4 py-2 text-sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-amber-50 dark:bg-black border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-600 dark:text-white" />
                <div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-white">{colleges.length}</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-300">Total Colleges</p>
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
                    {colleges.reduce((sum, c) => sum + (c.departments?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-300">Departments</p>
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
                    {colleges.reduce((sum, c) => sum + (c.users?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-300">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <Card className="border-0 bg-amber-50 dark:bg-black">
            <CardContent className="py-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-amber-400" />
            </CardContent>
          </Card>
        ) : filteredColleges.length === 0 ? (
          <Card className="border-0 bg-amber-50 dark:bg-black">
            <CardContent className="py-16 text-center">
              <Building2 className="h-16 w-16 mx-auto text-amber-500/30 dark:text-amber-400/30 mb-4" />
              <p className="text-muted-foreground dark:text-gray-400 font-medium">No colleges found</p>
              <p className="text-sm text-muted-foreground/60 dark:text-gray-500 mt-1">
                {searchTerm ? "Try a different search term" : "Add your first college to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredColleges.map((college) => (
              <Card
                key={college.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/95 dark:bg-black backdrop-blur-xl"
              >
                <CardHeader className="pb-3 px-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-lg">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer">
                        <CardTitle className="text-sm font-semibold truncate">
                          {typeof college.name === "object"
                            ? college.name?.en || college.name?.am || ""
                            : college.name || ""}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{college.code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-amber-100 dark:hover:bg-gray-800 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem  className="cursor-pointer"  onClick={() => router.push(`/dashboard/admin/colleges/${college.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-rose-600 dark:text-rose-400 cursor-pointer"
                          onClick={() => handleDelete(college.id)}
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
                    {college.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3 text-amber-600" />
                        <span className="text-xs truncate">{college.email}</span>
                      </div>
                    )}
                    {college.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3 text-amber-600" />
                        <span className="text-xs">{college.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium">{college.users?.length || 0}</span>
                        <span className="text-[10px] text-muted-foreground">users</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium">{college.departments?.length || 0}</span>
                        <span className="text-[10px] text-muted-foreground">depts</span>
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