"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import TeachersPage from '@/components/dashboard/department/teachers/TeachersPage';

export default function DepartmentTeachersPage() {
  return (
    <AdminDashboardLayout>
      <TeachersPage />
    </AdminDashboardLayout>
  );
}
