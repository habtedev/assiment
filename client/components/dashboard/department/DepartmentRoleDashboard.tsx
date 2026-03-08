"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DepartmentHeader } from "@/components/dashboard/department/layout/DepartmentHeader";

export default function DepartmentRoleDashboard() {
  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [studentMessage, setStudentMessage] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [teacherMessage, setTeacherMessage] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Handlers for student
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    setStudentMessage("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";
      const res = await fetch(`${baseUrl}/api/admin/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(studentForm),
      });
      const data = await res.json();
      if (res.ok) {
        setStudentMessage("Student added successfully.");
        setStudentForm({ name: "", email: "", password: "" });
      } else {
        setStudentMessage(data.error || "Failed to add student.");
      }
    } catch {
      setStudentMessage("Server error.");
    } finally {
      setStudentLoading(false);
    }
  };

  // Handlers for teacher
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherForm({ ...teacherForm, [e.target.name]: e.target.value });
  };
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherLoading(true);
    setTeacherMessage("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8500";
      const res = await fetch(`${baseUrl}/api/admin/add-teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(teacherForm),
      });
      const data = await res.json();
      if (res.ok) {
        setTeacherMessage("Teacher added successfully.");
        setTeacherForm({ name: "", email: "", password: "" });
      } else {
        setTeacherMessage(data.error || "Failed to add teacher.");
      }
    } catch {
      setTeacherMessage("Server error.");
    } finally {
      setTeacherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <DepartmentHeader />
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-10">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStudentSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" value={studentForm.name} onChange={handleStudentChange} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" value={studentForm.email} onChange={handleStudentChange} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" name="password" value={studentForm.password} onChange={handleStudentChange} required />
              </div>
              <Button type="submit" disabled={studentLoading} className="w-full rounded-xl">
                {studentLoading ? "Adding..." : "Add Student"}
              </Button>
              {studentMessage && <p className="text-sm text-center text-muted-foreground">{studentMessage}</p>}
            </form>
          </CardContent>
        </Card>
        <Separator />
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Add Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTeacherSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" value={teacherForm.name} onChange={handleTeacherChange} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" value={teacherForm.email} onChange={handleTeacherChange} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" name="password" value={teacherForm.password} onChange={handleTeacherChange} required />
              </div>
              <Button type="submit" disabled={teacherLoading} className="w-full rounded-xl">
                {teacherLoading ? "Adding..." : "Add Teacher"}
              </Button>
              {teacherMessage && <p className="text-sm text-center text-muted-foreground">{teacherMessage}</p>}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
