"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import TemplateList from '@/components/dashboard/department/templates/TemplateList';

export default function DepartmentTemplatesPage() {
  return (
    <AdminDashboardLayout>
      <TemplateList />
    </AdminDashboardLayout>
  );
}
