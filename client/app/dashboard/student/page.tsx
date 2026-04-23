"use client";

import React from "react";
import { AdminDashboardLayout } from "@/components/dashboard/student/layout/adminLayout";
import { DashboardOverview } from "@/components/dashboard/student/dashboard/DashboardOverview";

export default function StudentDashboard() {
  return (
    <AdminDashboardLayout>
      <DashboardOverview userName="Student" />
    </AdminDashboardLayout>
  );
}