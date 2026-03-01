import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import AddCollegeForm from "@/features/college-management/AddCollegeForm";

export default function NewCollegePage() {
  return (
    <AdminDashboardLayout>
      <div className="p-4 md:p-6">
        <AddCollegeForm />
      </div>
    </AdminDashboardLayout>
  );
}