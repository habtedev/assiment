import CollegeDashboardLayout from '@/components/dashboard/college/layouts/CollegeDashboardLayout';
import DepartmentsList from '@/components/dashboard/college/DepartmentsList';

export default function DepartmentsPage() {
  return (
    <CollegeDashboardLayout>
      <DepartmentsList />
    </CollegeDashboardLayout>
  );
}
