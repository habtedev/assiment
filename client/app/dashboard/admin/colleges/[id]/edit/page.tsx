"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import AddCollegeForm from "@/features/college-management/AddCollegeForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function EditCollegePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollege() {
      try {
        const unwrappedParams = await params;
        const collegeId = unwrappedParams.id;
        
        const res = await fetch(`${API_BASE_URL}/api/colleges/${collegeId}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("College not found");
          }
          throw new Error("Failed to fetch college");
        }
        
        const data = await res.json();
        setCollege(data);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchCollege();
  }, [params, toast]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !college) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-rose-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">College Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || "The college you're trying to edit doesn't exist."}
              </p>
              <Button onClick={() => router.push("/dashboard/admin/colleges")}>
                Return to Colleges
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4 md:p-6">
        <AddCollegeForm 
          initialData={college}
          isEdit={true}
          onSuccess={() => router.push("/dashboard/admin/colleges")}
          onCancel={() => router.back()}
        />
      </div>
    </AdminDashboardLayout>
  );
}