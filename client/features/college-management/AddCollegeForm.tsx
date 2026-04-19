"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  User,
  X,
  Save,
  Loader2,
  Phone,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getJwtToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

// Types
interface CollegeFormData {
  // Basic Info
  name: string;
  code: string;

  // Contact Info
  email: string;
  phone: string;

  // Admin Info
  adminName: string;
  // adminEmail field removed
  adminPassword: string;
  adminConfirmPassword: string;

  // Academic Info
  academicYear: string;
  // ...removed semester field
}

// Dynamically generate academic years: from 1990 to current year + 2
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear + 2 - 1990 }, (_, i) => {
  const start = 1990 + i;
  const end = start + 1;
  return {
    value: `${start}/${end.toString().slice(-2)}`,
    label: `${start}/${end.toString().slice(-2)}`,
  };
});

// ...removed SEMESTERS

const initialFormData: CollegeFormData = {
  name: "",
  code: "",
  email: "",
  phone: "",
  adminName: "",
  // adminEmail field removed
  adminPassword: "",
  adminConfirmPassword: "",
  academicYear: "",
  // ...removed semester from initialFormData
};

interface AddCollegeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CollegeFormData>;
  isEdit?: boolean;
}

export default function AddCollegeForm({
  onSuccess,
  onCancel,
  initialData,
  isEdit = false,
}: AddCollegeFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Helper to safely get string value from potentially bilingual objects
  const getStringValue = (value: any): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") return value.en || value.am || "";
    return "";
  };

  const [formData, setFormData] = useState<CollegeFormData>({
    ...initialFormData,
    ...(initialData ? {
      ...initialData,
      name: getStringValue(initialData.name),
    } : {}),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 1: Basic Info
    if (currentStep === 1) {
      const nameValue = getStringValue(formData.name);
      if (!nameValue?.trim()) {
        newErrors["name"] = "College name is required";
      }
      if (!formData.code?.trim()) {
        newErrors["code"] = "College code is required";
      } else if (formData.code.length > 10) {
        newErrors["code"] = "Code must not exceed 10 characters";
      }
    }

    // Step 2: Contact & Admin Info
    if (currentStep === 2) {
      if (!formData.email?.trim()) {
        newErrors["email"] = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors["email"] = "Please enter a valid email";
      }

      if (!formData.phone?.trim()) {
        newErrors["phone"] = "Phone number is required";
      }

      // Admin Info (only required for new colleges)
      if (!isEdit) {
        if (!formData.adminName?.trim()) {
          newErrors["adminName"] = "Admin name is required";
        }
        // adminEmail validation removed
        if (!formData.adminPassword?.trim()) {
          newErrors["adminPassword"] = "Password is required";
        } else if (formData.adminPassword.length < 6) {
          newErrors["adminPassword"] = "Password must be at least 6 characters";
        }
        if (formData.adminPassword !== formData.adminConfirmPassword) {
          newErrors["adminConfirmPassword"] = "Passwords do not match";
        }
      }
    }

    // Step 3: Academic Info
    if (currentStep === 3) {
      if (!formData.academicYear) {
        newErrors["academicYear"] = "Academic year is required";
      }
      // ...removed semester validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CollegeFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before final submission
    let allStepsValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      setCurrentStep(step);
      if (!validateForm()) {
        allStepsValid = false;
        break;
      }
    }

    if (!allStepsValid) {
      toast({
        title: "❌ Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = getJwtToken();
      const url = isEdit && initialData?.code
        ? `${API_BASE_URL}/api/colleges/${initialData.code}`
        : `${API_BASE_URL}/api/admin/add-college`;
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save college");
      }

      toast({
        title: isEdit ? "✅ College Updated" : "🎉 College Created",
        description: isEdit
          ? `${getStringValue(formData.name)} has been updated successfully.`
          : `${getStringValue(formData.name)} has been created successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/admin/colleges");
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to save college. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "❌ Validation Error",
        description: "Please fill in all required fields before proceeding",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };

  return (
    <Card className="w-full border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
      <CardHeader className="border-b border-amber-200/50 dark:border-amber-800/50 bg-linear-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-t-2xl px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-rose-600 rounded-xl blur-lg opacity-40 animate-pulse" />
              <div className="relative h-10 w-10 rounded-xl bg-linear-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                {isEdit ? "Edit College" : "Create New College"}
              </CardTitle>
              <CardDescription className="text-xs">
                Enter college details and create administrator account
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="rounded-full px-2 py-0.5 self-start sm:self-center text-xs">
            <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Step Indicators */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all",
                    getStepStatus(step) === "completed" && "bg-linear-to-r from-amber-500 to-rose-500 text-white",
                    getStepStatus(step) === "current" && "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-2 border-amber-500",
                    getStepStatus(step) === "upcoming" && "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}
                >
                  {getStepStatus(step) === "completed" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1 rounded",
                      getStepStatus(step) === "completed" || (step === 1 && currentStep > 1) || (step === 2 && currentStep > 2)
                        ? "bg-linear-to-r from-amber-500 to-rose-500"
                        : "bg-slate-200 dark:bg-slate-800"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            <span>Basic</span>
            <span>Contact</span>
            <span>Academic</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-amber-500 to-rose-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* College Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-amber-600" />
                      College Name
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="College of Informatics"
                      className={cn(errors.name && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* College Code */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-lg">🔤</span>
                      College Code
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      placeholder="CIS"
                      maxLength={10}
                      className={cn("mt-1.5", errors.code && "border-rose-500")}
                    />
                    {errors.code && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Admin Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Information Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className="text-lg">📞</span>
                      Contact Information
                    </h3>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                      Email
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="info@college.edu.et"
                      className={cn("mt-1.5", errors.email && "border-rose-500")}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-amber-600" />
                      Phone
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+251-XXX-XXXXXX"
                      className={cn("mt-1.5", errors.phone && "border-rose-500")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  {/* Admin Information Section */}
                  {!isEdit && (
                    <>
                      <div className="md:col-span-2 mt-3">
                        <Separator className="bg-amber-200/50" />
                        <h3 className="text-sm font-semibold mt-3 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-600" />
                          Administrator Information
                        </h3>
                      </div>
                      {/* Admin Name */}
                      <div>
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-600" />
                          Admin Name
                          <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.adminName}
                          onChange={(e) => handleInputChange("adminName", e.target.value)}
                          placeholder="Dr. Abebe Kebede"
                          className={cn("mt-1.5", errors.adminName && "border-rose-500")}
                        />
                        {errors.adminName && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.adminName}
                          </p>
                        )}
                      </div>
                      {/* Admin Password */}
                      <div>
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4 text-amber-600" />
                          Password
                          <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.adminPassword}
                            onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                            placeholder="••••••••"
                            className={cn("pr-10", errors.adminPassword && "border-rose-500")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.adminPassword && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.adminPassword}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4 text-amber-600" />
                          Confirm Password
                          <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.adminConfirmPassword}
                            onChange={(e) => handleInputChange("adminConfirmPassword", e.target.value)}
                            placeholder="••••••••"
                            className={cn("pr-10", errors.adminConfirmPassword && "border-rose-500")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.adminConfirmPassword && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.adminConfirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-amber-600" />
                      Academic Information
                    </h3>
                  </div>

                  {/* Academic Year */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-amber-600" />
                      Academic Year
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={formData.academicYear}
                      onValueChange={(value) => handleInputChange("academicYear", value)}
                    >
                      <SelectTrigger className={cn("mt-1.5", errors.academicYear && "border-rose-500")}>
                        <SelectValue placeholder="Select year..." />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.academicYear && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.academicYear}
                      </p>
                    )}
                  </div>

                  {/* // ...removed semester UI */}

                  {/* Summary Card */}
                  <div className="md:col-span-2 mt-4">
                    <Card className="bg-linear-to-br from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border-0">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Summary
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              College Name
                            </p>
                            <p className="font-medium text-sm truncate">
                              {getStringValue(formData.name) || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Code
                            </p>
                            <p className="font-medium text-sm">{formData.code || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Email
                            </p>
                            <p className="font-medium text-sm truncate">{formData.email || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Phone
                            </p>
                            <p className="font-medium text-sm">{formData.phone || "Not set"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer Buttons */}
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 pt-3 border-t bg-linear-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/20 dark:to-rose-950/20 rounded-b-2xl">
              <div className="flex gap-2 w-full sm:w-auto">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="rounded-full px-3 py-1.5 text-sm flex-1 sm:flex-initial"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel || (() => router.push("/dashboard/admin/colleges"))}
                  className="rounded-full px-3 py-1.5 text-sm flex-1 sm:flex-initial"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full px-3 py-1.5 text-sm bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 flex-1 sm:flex-initial"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-full px-3 py-1.5 text-sm bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 min-w-24 flex-1 sm:flex-initial"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        {isEdit ? "Update" : "Create"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
}