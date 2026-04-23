"use client";

import { TemplateList } from "@/components/dashboard/student/dashboard/TemplateList";
import { AdminDashboardLayout } from "@/components/dashboard/student/layout/adminLayout";

export default function StudentTemplatesPage() {
  return (
    <AdminDashboardLayout>
      <TemplateList />
    </AdminDashboardLayout>
  );
}
