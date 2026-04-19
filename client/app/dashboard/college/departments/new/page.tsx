"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CollegeDashboardLayout from '@/components/dashboard/college/layouts/CollegeDashboardLayout';
import AddDepartmentForm from '@/components/dashboard/college/AddDepartmentForm';
export default function CollegeDashboardPage() {
  const router = useRouter();

  return (
     <CollegeDashboardLayout>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/college/departments")}
          className="cursor-pointer h-10"
        >
          <ArrowLeft className="h-4 w-4 mr-2 " />
          Back to Departments
        </Button>
      </div>
       <div className="flex justify-center  min-h-[calc(100vh-200px)] p-6">
        <AddDepartmentForm />
      </div>
    </CollegeDashboardLayout>
  );
}
