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
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";

import { AdminDashboardLayout } from '@/components/dashboard/department/layout/DepartmentLayout';
import { toast } from "@/components/ui/use-toast";

// Form Schema with Zod
const courseSchema = z.object({
  code: z.string().min(3, "Course code must be at least 3 characters"),
  name: z.string().min(2, "Course name must be at least 2 characters"),
  credits: z.string().min(1, "Credits are required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function AddCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      name: "",
      credits: "",
    },
  });

  const selectedCredits = watch("credits");

  const onSubmit = async (data: CourseFormData) => {
    startTransition(async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch("http://localhost:8500/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create course");
        }

        toast({
          title: "Success",
          description: "Course added successfully!",
        });

        router.push("/dashboard/department/courses");
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add course. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    router.push("/dashboard/department/courses");
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
            <h1 className="text-3xl font-bold tracking-tight">Add New Course</h1>
            <p className="text-muted-foreground mt-1">
              Create a new course with details and instructor assignment
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              Course Information
            </CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Course Code <span className="text-destructive">*</span></Label>
                <Input
                  id="code"
                  placeholder="e.g., CS101"
                  {...register("code")}
                  className={errors.code ? "border-destructive" : ""}
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>

              {/* Course Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Course Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g., Introduction to Computer Science"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Credits */}
              <div className="space-y-2">
                <Label htmlFor="credits">Credits <span className="text-destructive">*</span></Label>
                <Select
                  value={selectedCredits}
                  onValueChange={(value) => setValue("credits", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Credit</SelectItem>
                    <SelectItem value="2">2 Credits</SelectItem>
                    <SelectItem value="3">3 Credits</SelectItem>
                    <SelectItem value="4">4 Credits</SelectItem>
                    <SelectItem value="5">5 Credits</SelectItem>
                    <SelectItem value="6">6 Credits</SelectItem>
                  </SelectContent>
                </Select>
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
                      Adding Course...
                    </>
                  ) : (
                    "Add Course"
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
