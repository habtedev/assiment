"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  PlusCircle, 
  Building2, 
  Mail, 
  Lock, 
  User,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function AddCollegeForm() {
  const { toast } = useToast();
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
      const response = await fetch("http://localhost:8500/api/admin/add-college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to add college");
      const data = await response.json();
      toast({
        title: "College Added Successfully",
        description: `${form.collegeName} has been registered.`,
      });
      setForm({ name: "", email: "", password: "", collegeName: "" });
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">
          College Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Register and manage colleges in the system
        </p>
      </div>

      <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white cursor-pointer">
              <PlusCircle className="h-4 w-4" />
            </div>
            <CardTitle>Add New College</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Admin Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. Abebe Kebede"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@college.edu.et"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeName" className="text-sm font-medium">College Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="collegeName"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  placeholder="College of Informatics"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white",
                "hover:from-amber-600 hover:to-rose-600 transition-all",
                "disabled:opacity-50"
              )}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create College
                </>
              )}
            </Button>

            {message && (
              <div className={cn(
                "p-3 rounded-lg text-sm flex items-center gap-2",
                message.includes("success")
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-900/30"
              )}>
                {message.includes("success") ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}