"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SignIn from "@/components/shared/sinin/SignIn";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function UniversityLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent/received
      });

      if (!response.ok) {
        toast({
          title: "Authentication Failed",
          description: "Invalid university credentials.",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();

      toast({
        title: "Access Granted",
        description: `Welcome ${data.user?.name || "User"}`,
      });

      const role = data.user?.role?.name;

      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "COLLEGE") router.push("/dashboard/college");
      else if (role === "HEAD") router.push("/dashboard/head");
      else if (role === "DEPARTMENT") router.push("/dashboard/department");
      else if (role === "STUDENT") router.push("/dashboard/student");
      else if (role === "TEACHER") router.push("/dashboard/teacher");
      else router.push("/dashboard");
    } catch {
      toast({
        title: "Server Error",
        description: "Unable to connect to authentication service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email.endsWith("@uog.edu.et")) {
      toast({
        title: "Invalid Email",
        description: "Use your official university email.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for instructions.",
      });

      return true;
    } catch {
      toast({
        title: "Reset Failed",
        description: "Please contact system administrator.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Top Navigation */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl overflow-hidden shadow border">
              <img
                src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1770387114/new_ghw5vi.jpg"
                alt="University Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight">
                University of Gondar
              </h1>
              <p className="text-xs text-muted-foreground">
                Teacher Assessment & HR Portal
              </p>
            </div>
          </div>

          <Badge variant="outline" className="rounded-xl">
            Secure Access
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl w-full items-center">
          {/* Left Info Panel */}
          <div className="hidden lg:block space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Academic Performance & Staff Management Platform
            </h2>
            <p className="text-muted-foreground">
              Centralized system for secure teacher evaluation, HR operations,
              and academic analytics.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Semester-based teacher performance evaluation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Role-based secure authentication system
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Card */}
          <Card className="rounded-2xl shadow-xl border bg-background">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Sign In</h2>
                <p className="text-sm text-muted-foreground">
                  Use your official university credentials
                </p>
              </div>

              <SignIn
                onSignIn={handleSignIn}
                onResetPassword={handleResetPassword}
                isLoading={isLoading}
              />

              <Separator className="my-6" />

              <div className="text-xs text-center text-muted-foreground">
                © {new Date().getFullYear()} University of Gondar
                <br />
                Authorized personnel only
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
