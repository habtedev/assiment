"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import EnrollmentsPage from '@/components/dashboard/department/enrollments/EnrollmentsPage';

export default function DepartmentEnrollmentsPage() {
  return (
    <AdminDashboardLayout>
      <EnrollmentsPage />
    </AdminDashboardLayout>
  );
}
