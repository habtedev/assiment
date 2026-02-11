"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Users, Building2, PlusCircle } from "lucide-react";
import Header from "@/components/shared/header/Header";

const analytics = [
  { label: "Total Users", value: 120, icon: Users },
  { label: "Total Colleges", value: 8, icon: Building2 },
  { label: "Assessments", value: 34, icon: BarChart3 },
];

export default function AdminDashboard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
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

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/add-college`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('[ADD COLLEGE] Failed to parse JSON:', jsonErr);
      }

      if (res.ok) {
        setMessage("College added successfully.");
        setForm({ name: "", email: "", password: "", collegeName: "" });
      } else {
        setMessage((data as any).error || "Failed to add college.");
        console.error('[ADD COLLEGE ERROR]', (data as any).error || res.statusText, data);
        alert(`Error: ${(data as any).error || res.statusText}`);
      }
    } catch (err) {
      setMessage("Server error.");
      console.error('[ADD COLLEGE ERROR] Network/server error:', err);
      alert('Server/network error. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Manage colleges, users, and system analytics
            </p>
          </div>
          <Badge variant="outline" className="rounded-xl">
            System Overview
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

        {/* Add College Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                <CardTitle>Add New College</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Admin Name</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter admin name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@university.edu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Secure password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>College Name</Label>
                  <Input
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handleChange}
                    placeholder="College of Informatics"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-xl">
                  {loading ? "Adding..." : "Create College"}
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
