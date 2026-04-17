"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import StudentsPage from '@/components/dashboard/department/students/StudentsPage';

export default function DepartmentStudentsPage() {
  return (
    <AdminDashboardLayout>
      <StudentsPage />
    </AdminDashboardLayout>
  );
}
