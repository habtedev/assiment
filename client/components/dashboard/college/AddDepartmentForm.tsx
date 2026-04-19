"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Generate academic years from 1990 to current year + 2
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear + 2 - 1990 }, (_, i) => {
  const start = 1990 + i;
  const end = start + 1;
  return {
    value: `${start}/${end.toString().slice(-2)}`,
    label: `${start}/${end.toString().slice(-2)}`,
  };
});

export default function AddDepartmentForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
    contactEmail: "",
    contactPhone: "",
    adminName: "",
    adminPassword: "",
    confirmPassword: "",
    academicYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.adminPassword !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        departmentName: form.departmentName,
        departmentCode: form.departmentCode,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        adminName: form.adminName,
        adminPassword: form.adminPassword,
        academicYear: form.academicYear,
      };

      const response = await fetch(`${API_BASE_URL}/api/colleges/add-department`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || "Failed to add department");
      }
      const data = await response.json();
      toast({
        title: "Department Added Successfully",
        description: `${form.departmentName} has been created.`,
      });
      setForm({
        departmentName: "",
        departmentCode: "",
        contactEmail: "",
        contactPhone: "",
        adminName: "",
        adminPassword: "",
        confirmPassword: "",
        academicYear: "",
      });
      setTimeout(() => router.push("/dashboard/college"), 2000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto border bg-white dark:bg-black">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Add Department</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department Name</Label>
              <Input name="departmentName" value={form.departmentName} onChange={handleChange} placeholder="Department of Computer Science" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department Code</Label>
              <Input name="departmentCode" value={form.departmentCode} onChange={handleChange} placeholder="CS" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</Label>
              <Input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="info@college.edu.et" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</Label>
              <Input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+251-XXX-XXXXXX" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Name</Label>
              <Input name="adminName" value={form.adminName} onChange={handleChange} placeholder="Dr. Abebe Kebede" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
              <Input type="password" name="adminPassword" value={form.adminPassword} onChange={handleChange} placeholder="••••••••" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
              <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</Label>
              <Select value={form.academicYear} onValueChange={(value) => setForm({ ...form, academicYear: value })}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select year..." />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
            {loading ? "Creating..." : "Create Department"}
          </Button>

          {message && (
            <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.includes("success") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
              {message.includes("success") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}