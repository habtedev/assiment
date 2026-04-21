"use client";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import CoursesPage from '@/components/dashboard/department/courses/CoursesPage';

export default function DepartmentCoursesPage() {
  return (
    <AdminDashboardLayout>
      <CoursesPage />
    </AdminDashboardLayout>
  );
}
