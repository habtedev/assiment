"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import DepartmentDashboard from '@/components/dashboard/department/dashboard/DepartmentDashboard';

export default function DepartmentRoleDashboardPage() {
  return (
    <AdminDashboardLayout>
      <DepartmentDashboard />
    </AdminDashboardLayout>
  );
}
