"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  GraduationCap, 
  Sparkles, 
  Heart,
  BookOpen,
  BarChart3,
  Users,
  Award,
  Lightbulb
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SignIn from "@/components/shared/sinin/SignIn";
import { AppHeader } from "@/components/shared/header/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // ✅ ADD THIS

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Campus love hero section - WITH FULL TRANSLATION SUPPORT
const HeroSection = memo(() => {
  const { t } = useTranslation(); // ✅ ADD THIS HOOK
  
  const features = [
    {
      icon: BookOpen,
      titleKey: "features.teacher.title",
      descriptionKey: "features.teacher.description",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: Award,
      titleKey: "features.student.title",
      descriptionKey: "features.student.description",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: Lightbulb,
      titleKey: "features.growth.title",
      descriptionKey: "features.growth.description",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="hidden lg:block space-y-8">
      {/* Campus Pride Badge - TRANSLATED */}
      <Badge 
        variant="outline" 
        className="rounded-full px-5 py-2 text-sm border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 text-amber-700 dark:text-amber-300 shadow-sm"
      >
        <Heart className="h-3.5 w-3.5 mr-1.5 text-rose-500 fill-rose-500" />
        {t('platform.badge')}
        <Heart className="h-3.5 w-3.5 ml-1.5 text-rose-500 fill-rose-500" />
      </Badge>

      {/* Main Heading - Campus Love - TRANSLATED */}
      <div className="space-y-6">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-amber-700 via-rose-700 to-amber-700 dark:from-amber-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
            {t('platform.heading.line1') || "Shaping Tomorrow's"}
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-600 to-rose-600 dark:from-amber-300 dark:to-rose-300 bg-clip-text text-transparent">
            {t('platform.heading.line2') || "Educators Today"}
          </span>
        </h1>
        
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-lg blur" />
          <p className="relative text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-medium italic">
            "{t('platform.quote')}"
          </p>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {t('platform.description')}
        </p>
      </div>

      {/* Campus Feature Grid - Warm & Inviting - TRANSLATED */}
      <div className="grid gap-5 pt-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group flex items-start gap-5 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-amber-100/50 dark:border-amber-900/50 hover:border-amber-200 dark:hover:border-amber-800 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br shadow-md",
                feature.bgColor
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  feature.iconColor
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {t(Array.isArray(feature.titleKey) ? feature.titleKey[0] : feature.titleKey)}
                  {index === 0 && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t(Array.isArray(feature.descriptionKey) ? feature.descriptionKey[0] : feature.descriptionKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Community Stats - Warm & Human - TRANSLATED */}
      <div className="flex flex-col gap-4 pt-8">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ring-2 ring-white dark:ring-slate-900 shadow-lg flex items-center justify-center text-white font-semibold text-xs"
              >
                {['JD', 'MA', 'SK', 'AT', 'RN'][i-1]}
              </div>
            ))}
          </div>
          <div className="text-sm">
            <span className="font-bold text-amber-700 dark:text-amber-400">500+</span>
            <span className="text-slate-600 dark:text-slate-400 ml-1">{t('stats.teachers')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-amber-600" />
            <span>8,200+ {t('stats.students')}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <span>95% {t('stats.satisfaction')}</span>
          </div>
        </div>
      </div>

      {/* Campus Quote - TRANSLATED */}
      <div className="pt-6 border-t border-amber-100 dark:border-amber-900/50">
        <p className="text-xs text-slate-500 dark:text-slate-500 italic">
          {t('platform.legacy')}
        </p>
      </div>
    </div>
  );
});

HeroSection.displayName = "HeroSection";



// Main component
export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        toast({
          title: "Welcome back!",
          description: "Let's try that again with your university email.",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      
      toast({
        title: "Welcome to UoG! 🎓",
        description: `Great to see you, ${data.user?.name || "Educator"}!`,
      });

      const role = data.user?.role?.name;
      const routes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        COLLEGE: "/dashboard/college",
        HEAD: "/dashboard/head",
        DEPARTMENT: "/dashboard/department",
        STUDENT: "/dashboard/student",
        TEACHER: "/dashboard/teacher",
      };

      router.push(routes[role] || "/dashboard");
    } catch (error) {
      toast({
        title: "Connection Issue",
        description: "Our campus network is taking a moment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  const handleResetPassword = useCallback(async (email: string) => {
    if (!email.endsWith("@uog.edu.et")) {
      toast({
        title: "Campus Email Required",
        description: "Please use your official @uog.edu.et email address.",
        variant: "destructive",
      });
      return;
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
        title: "Check Your Inbox 📧",
        description: "We've sent reset instructions to your campus email.",
      });
    } catch {
      toast({
        title: "Reset Link Issue",
        description: "Visit the IT Help Desk or contact your department office.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Skeleton className="h-16 w-full" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 selection:bg-amber-500/20">
      {/* ✅ Use AppHeader - it has working language switcher */}
      <AppHeader />
      
      {/* Warm Campus Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-gradient-to-r from-amber-200/30 to-rose-200/30 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-r from-amber-200/30 to-rose-200/30 dark:from-amber-900/10 dark:to-rose-900/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-amber-100/20 to-rose-100/20 dark:from-amber-900/5 dark:to-rose-900/5 blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          <HeroSection />

          {/* Premium Sign In Card - Campus Style */}
          <div className="relative">
            {/* Decorative Elements - Warm Gradient */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-rose-500 rounded-3xl blur opacity-30 animate-pulse" />
            
            <Card className="relative rounded-2xl border-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-end mb-4">
                  <Badge 
                    variant="outline" 
                    className="rounded-full px-4 py-1.5 text-xs border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/50 dark:to-rose-950/50"
                  >
                    <Shield className="h-3 w-3 mr-1.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                      UoG Campus Portal
                    </span>
                  </Badge>
                </div>

                <SignIn
                  onSignIn={handleSignIn}
                  onResetPassword={handleResetPassword}
                  isLoading={isLoading}
                />

                <div className="mt-8 pt-6 border-t border-amber-100 dark:border-amber-900/50">
                  <p className="text-xs text-center text-slate-500 dark:text-slate-500 flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    © {new Date().getFullYear()} University of Gondar - Teacher Assessment System
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                  </p>
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-2">
                    Dedicated to excellence in teaching and learning since 1954
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}