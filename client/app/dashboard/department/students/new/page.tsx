"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, Loader2, X, Plus } from "lucide-react";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import { toast } from "@/components/ui/use-toast"; // or sonner toast

// Form Schema with Zod
const studentSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters").optional(),
  year: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year"]),
  sections: z.array(z.string()).min(1, "At least one section is required"),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function AddStudentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<string[]>([]);
  const [newSection, setNewSection] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      year: "1st Year",
      sections: [],
    },
  });

  const selectedYear = watch("year");

  const addSection = () => {
    if (newSection.trim() && !sections.includes(newSection.trim())) {
      const updatedSections = [...sections, newSection.trim()];
      setSections(updatedSections);
      setValue("sections", updatedSections);
      setNewSection("");
    }
  };

  const removeSection = (sectionToRemove: string) => {
    const updatedSections = sections.filter(s => s !== sectionToRemove);
    setSections(updatedSections);
    setValue("sections", updatedSections);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSection();
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    startTransition(async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch("http://localhost:8500/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create student");
        }

        toast({
          title: "Success",
          description: "Student added successfully!",
        });

        router.push("/dashboard/department/students");
        router.refresh(); // Optional: refresh server data
      } catch (error) {
        console.error("Error adding student:", error);
        toast({
          title: "Error",
          description: "Failed to add student. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    router.push("/dashboard/department/students");
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
            <p className="text-muted-foreground mt-1">
              Create a new student profile with personal and academic details
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <UserPlus className="h-6 w-6 text-primary" />
              Student Information
            </CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Enter student's full name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251 911 123 456"
                  {...register("phone")}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password (optional)"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password (optional)"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Academic Year and Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select
                    value={selectedYear}
                    onValueChange={(value) => setValue("year", value as StudentFormData["year"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <div className="flex gap-2">
                    <Input
                      id="section"
                      placeholder="e.g., Section A"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addSection}
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.sections && (
                    <p className="text-sm text-destructive">{errors.sections.message}</p>
                  )}
                  {sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sections.map((section) => (
                        <Badge
                          key={section}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {section}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-destructive/10 cursor-pointer"
                            onClick={() => removeSection(section)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isPending || isSubmitting}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Student...
                    </>
                  ) : (
                    "Add Student"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}