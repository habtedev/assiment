

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CollegeDashboardLayout from '@/components/dashboard/college/layouts/CollegeDashboardLayout';
import CollegeDashboard from '@/components/dashboard/college/CollegeDashboard';
export default function CollegeDashboardPage() {
  const router = useRouter();

  return (
     <CollegeDashboardLayout>
      <div className="mb-4">
      </div>
       <CollegeDashboard />
    </CollegeDashboardLayout>
  );
}


