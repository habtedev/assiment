"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Users, Building2, PlusCircle } from "lucide-react";
import { CollegeHeader } from "./layouts/CollegeHeader";


const analytics = [
  { label: "Total Departments", value: 5, icon: Building2 },
  { label: "Total Students", value: 200, icon: Users },
  { label: "Assessments", value: 12, icon: BarChart3 },
];

export default function CollegeDashboard() {
  const [form, setForm] = useState({
    departmentName: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/add-department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Department and head user added successfully.");
        setForm({ departmentName: "", name: "", email: "", password: "" });
      } else {
        setMessage(data.error || "Failed to add department.");
      }
    } catch {
      setMessage("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
    <CollegeHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">College Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Manage departments, students, and analytics
            </p>
          </div>
          <Badge variant="outline" className="rounded-xl">
            College Overview
          </Badge>
        </div>
        {/* Analytics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {analytics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Separator />
        {/* Add Department Form (like admin add college) */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                <CardTitle>Add New Department</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input
                    name="departmentName"
                    value={form.departmentName}
                    onChange={handleChange}
                    placeholder="Department of Computer Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Head Name</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Head's Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Head Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="head@university.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Head Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Secure password"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-xl">
                  {loading ? "Adding..." : "Create Department"}
                </Button>
                {message && (
                  <p className="text-sm text-center text-muted-foreground">
                    {message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
          {/* Placeholder for Future Chart or Activity */}
          <Card className="rounded-2xl shadow-sm flex items-center justify-center">
            <CardContent className="text-center space-y-3">
              <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Analytics charts and recent activity will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
