"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import AddCollegeForm from "@/features/college-management/AddCollegeForm";

export default function NewCollegePage() {
  const router = useRouter();

  return (
    <AdminDashboardLayout>
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admin/colleges")}
          className="rounded-full cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2 " />
          Back to Colleges
        </Button>
      </div>
      <AddCollegeForm />
    </AdminDashboardLayout>
  );
}