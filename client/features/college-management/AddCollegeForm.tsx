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
  Globe,
  Phone,
  MapPin,
  BookOpen,
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
import { Textarea } from "@/components/ui/textarea";
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
type Language = "en" | "am";

interface CollegeFormData {
  // Basic Info
  name: Record<Language, string>;
  code: string;
  description: Record<Language, string>;
  
  // Contact Info
  email: string;
  phone: string;
  address: Record<Language, string>;
  
  // Admin Info
  adminName: string;
  // adminEmail field removed
  adminPassword: string;
  adminConfirmPassword: string;
  
  // Academic Info
  academicYear: string;
  // ...removed semester field
  studentCount?: number;
  teacherCount?: number;
  departmentCount?: number;
  
  // Status
  status: "active" | "inactive";
}

const LANGUAGES = [
  { code: "en" as Language, label: "English", flag: "🇬🇧" },
  { code: "am" as Language, label: "አማርኛ", flag: "🇪🇹" },
];

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

const COLLEGE_STATUS = [
  { value: "active", label: "Active", labelAm: "ንቁ", color: "bg-emerald-500" },
  { value: "inactive", label: "Inactive", labelAm: "ንቁ ያልሆነ", color: "bg-slate-500" },
  // Removed pending status
];

const initialFormData: CollegeFormData = {
  name: { en: "", am: "" },
  code: "",
  description: { en: "", am: "" },
  email: "",
  phone: "",
  address: { en: "", am: "" },
  adminName: "",
  // adminEmail field removed
  adminPassword: "",
  adminConfirmPassword: "",
  academicYear: "",
  // ...removed semester from initialFormData
  status: "active",
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
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [formData, setFormData] = useState<CollegeFormData>({
    ...initialFormData,
    ...initialData,
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
      if (!formData.name.en?.trim()) {
        newErrors["name.en"] = currentLang === "am" ? "የኮሌጅ ስም ያስፈልጋል" : "College name is required";
      }
      if (!formData.name.am?.trim()) {
        newErrors["name.am"] = currentLang === "am" ? "የኮሌጅ ስም በአማርኛ ያስፈልጋል" : "College name in Amharic is required";
      }
      if (!formData.code?.trim()) {
        newErrors["code"] = currentLang === "am" ? "የኮሌጅ ኮድ ያስፈልጋል" : "College code is required";
      } else if (formData.code.length > 10) {
        newErrors["code"] = currentLang === "am" ? "ኮድ ከ10 ቁምፊዎች መብለጥ የለበትም" : "Code must not exceed 10 characters";
      }
    }

    // Step 2: Contact & Admin Info
    if (currentStep === 2) {
      if (!formData.email?.trim()) {
        newErrors["email"] = currentLang === "am" ? "ኢሜይል ያስፈልጋል" : "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors["email"] = currentLang === "am" ? "ትክክለኛ ኢሜይል ያስገቡ" : "Please enter a valid email";
      }

      if (!formData.phone?.trim()) {
        newErrors["phone"] = currentLang === "am" ? "ስልክ ቁጥር ያስፈልጋል" : "Phone number is required";
      }

      // Admin Info (only required for new colleges)
      if (!isEdit) {
        if (!formData.adminName?.trim()) {
          newErrors["adminName"] = currentLang === "am" ? "የአስተዳዳሪ ስም ያስፈልጋል" : "Admin name is required";
        }
        // adminEmail validation removed
        if (!formData.adminPassword?.trim()) {
          newErrors["adminPassword"] = currentLang === "am" ? "የይለፍ ቃል ያስፈልጋል" : "Password is required";
        } else if (formData.adminPassword.length < 6) {
          newErrors["adminPassword"] = currentLang === "am" 
            ? "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት" 
            : "Password must be at least 6 characters";
        }
        if (formData.adminPassword !== formData.adminConfirmPassword) {
          newErrors["adminConfirmPassword"] = currentLang === "am" 
            ? "የይለፍ ቃሎች አይዛመዱም" 
            : "Passwords do not match";
        }
      }
    }

    // Step 3: Academic Info
    if (currentStep === 3) {
      if (!formData.academicYear) {
        newErrors["academicYear"] = currentLang === "am" ? "የትምህርት ዓመት ያስፈልጋል" : "Academic year is required";
      }
      // ...removed semester validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CollegeFormData,
    value: string,
    lang?: Language
  ) => {
    if (lang && (field === "name" || field === "description" || field === "address")) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field
    const errorKey = lang ? `${field}.${lang}` : field;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
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
        title: currentLang === "am" ? "❌ ማረጋገጫ ስህተት" : "❌ Validation Error",
        description: currentLang === "am" 
          ? "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ" 
          : "Please fill in all required fields",
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
          ? `${formData.name.en} has been updated successfully.`
          : `${formData.name.en} has been created successfully.`,
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
        title: currentLang === "am" ? "❌ ማረጋገጫ ስህተት" : "❌ Validation Error",
        description: currentLang === "am" 
          ? "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ" 
          : "Please fill in all required fields before proceeding",
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
    <Card className="w-full max-w-4xl mx-auto border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="border-b border-amber-200/50 dark:border-amber-800/50 bg-linear-to-r from-amber-50/50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-rose-600 rounded-xl blur-lg opacity-40 animate-pulse" />
              <div className="relative h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-linear-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
                {isEdit 
                  ? (currentLang === "am" ? "ኮሌጅ አርትዕ" : "Edit College")
                  : (currentLang === "am" ? "አዲስ ኮሌጅ ፍጠር" : "Create New College")}
              </CardTitle>
              <CardDescription>
                {currentLang === "am"
                  ? "የኮሌጅ መረጃዎችን ያስገቡ እና የአስተዳዳሪ መለያ ይፍጠሩ"
                  : "Enter college details and create administrator account"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 self-start sm:self-center">
            <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Language Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300 mr-2">
            {currentLang === "am" ? "ቋንቋ:" : "Language:"}
          </span>
          <div className="flex gap-1">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLang === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentLang(lang.code)}
                className={cn(
                  "rounded-full px-2 sm:px-3 py-1 h-8 text-xs sm:text-sm transition-all",
                  currentLang === lang.code &&
                    "bg-linear-to-r from-amber-500 to-rose-500 text-white border-0 shadow-md"
                )}
              >
                <span className="mr-1 text-base">{lang.flag}</span>
                <span className="hidden sm:inline">{lang.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                    getStepStatus(step) === "completed" && "bg-linear-to-r from-amber-500 to-rose-500 text-white",
                    getStepStatus(step) === "current" && "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-2 border-amber-500",
                    getStepStatus(step) === "upcoming" && "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}
                >
                  {getStepStatus(step) === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      "w-12 sm:w-24 h-1 mx-1 sm:mx-2 rounded",
                      getStepStatus(step) === "completed" || (step === 1 && currentStep > 1) || (step === 2 && currentStep > 2)
                        ? "bg-linear-to-r from-amber-500 to-rose-500"
                        : "bg-slate-200 dark:bg-slate-800"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Basic Info</span>
            <span>Contact & Admin</span>
            <span>Academic Info</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-amber-500 to-rose-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* College Name (Bilingual) */}
                  <div className="space-y-4 md:col-span-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-amber-600" />
                      {currentLang === "am" ? "የኮሌጅ ስም" : "College Name"}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {LANGUAGES.map((lang) => (
                        <div key={lang.code} className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
                            {lang.flag}
                          </div>
                          <Input
                            value={formData.name[lang.code]}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value, lang.code)
                            }
                            placeholder={lang.code === "en" ? "College of Informatics" : "ኮሌጅ ኦፍ ኢንፎርማቲክስ"}
                            className={cn(
                              "pl-10",
                              errors[`name.${lang.code}`] && "border-rose-500 focus-visible:ring-rose-500"
                            )}
                          />
                          {errors[`name.${lang.code}`] && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors[`name.${lang.code}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* College Code */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-lg">🔤</span>
                      {currentLang === "am" ? "የኮሌጅ ኮድ" : "College Code"}
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

                  {/* Status */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      {currentLang === "am" ? "ሁኔታ" : "Status"}
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive" | "pending") => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLEGE_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${status.color}`} />
                              {currentLang === "am" ? status.labelAm : status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description (Bilingual) */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      {currentLang === "am" ? "መግለጫ" : "Description"}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1.5">
                      {LANGUAGES.map((lang) => (
                        <div key={lang.code} className="relative">
                          <div className="absolute left-3 top-3 text-base">
                            {lang.flag}
                          </div>
                          <Textarea
                            value={formData.description[lang.code]}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value, lang.code)
                            }
                            placeholder={lang.code === "en" ? "College description..." : "የኮሌጅ መግለጫ..."}
                            className="pl-10 min-h-25"
                          />
                        </div>
                      ))}
                    </div>
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-2xl">📞</span>
                      {currentLang === "am" ? "የመገናኛ መረጃ" : "Contact Information"}
                    </h3>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                      {currentLang === "am" ? "ኢሜይል" : "Email"}
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
                      {currentLang === "am" ? "ስልክ" : "Phone"}
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

                  {/* Address (Bilingual) */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      {currentLang === "am" ? "አድራሻ" : "Address"}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1.5">
                      {LANGUAGES.map((lang) => (
                        <div key={lang.code} className="relative">
                          <div className="absolute left-3 top-3 text-base">
                            {lang.flag}
                          </div>
                          <Textarea
                            value={formData.address[lang.code]}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value, lang.code)
                            }
                            placeholder={lang.code === "en" ? "Address..." : "አድራሻ..."}
                            className="pl-10 min-h-20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Information Section */}
                  {!isEdit && (
                    <>
                      <div className="md:col-span-2 mt-4">
                        <Separator className="bg-amber-200/50" />
                        <h3 className="text-lg font-semibold mt-4 mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-amber-600" />
                          {currentLang === "am" ? "የአስተዳዳሪ መረጃ" : "Administrator Information"}
                        </h3>
                      </div>

                      {/* Admin Name */}
                      <div>
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-600" />
                          {currentLang === "am" ? "የአስተዳዳሪ ስም" : "Admin Name"}
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

                      {/* Admin Email */}
                      {/* Admin email input removed */}

                      {/* Admin Password */}
                      <div>
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4 text-amber-600" />
                          {currentLang === "am" ? "የይለፍ ቃል" : "Password"}
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
                          {currentLang === "am" ? "የይለፍ ቃል አረጋግጥ" : "Confirm Password"}
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-amber-600" />
                      {currentLang === "am" ? "የአካዳሚክ መረጃ" : "Academic Information"}
                    </h3>
                  </div>

                  {/* Academic Year */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-amber-600" />
                      {currentLang === "am" ? "የትምህርት ዓመት" : "Academic Year"}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={formData.academicYear}
                      onValueChange={(value) => handleInputChange("academicYear", value)}
                    >
                      <SelectTrigger className={cn("mt-1.5", errors.academicYear && "border-rose-500")}>
                        <SelectValue placeholder={currentLang === "am" ? "ዓመት ይምረጡ" : "Select year..."} />
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
                          {currentLang === "am" ? "ማጠቃለያ" : "Summary"}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {currentLang === "am" ? "የኮሌጅ ስም" : "College Name"}
                            </p>
                            <p className="font-medium text-sm truncate">
                              {formData.name.en || formData.name.am || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {currentLang === "am" ? "ኮድ" : "Code"}
                            </p>
                            <p className="font-medium text-sm">{formData.code || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {currentLang === "am" ? "ኢሜይል" : "Email"}
                            </p>
                            <p className="font-medium text-sm truncate">{formData.email || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {currentLang === "am" ? "ስልክ" : "Phone"}
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
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-6 pt-3 border-t bg-linear-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/20 dark:to-rose-950/20 rounded-b-2xl">
        <div className="flex gap-2 w-full sm:w-auto">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="rounded-full px-4 sm:px-6 flex-1 sm:flex-initial"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentLang === "am" ? "ቀዳሚ" : "Previous"}
            </Button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
            className="rounded-full px-4 sm:px-6 flex-1 sm:flex-initial"
          >
            <X className="h-4 w-4 mr-2" />
            {currentLang === "am" ? "ሰርዝ" : "Cancel"}
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="rounded-full px-4 sm:px-6 bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 flex-1 sm:flex-initial"
            >
              {currentLang === "am" ? "ቀጣይ" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full px-4 sm:px-6 bg-linear-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 min-w-30 flex-1 sm:flex-initial"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentLang === "am" ? "በማስቀመጥ ላይ..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit 
                    ? (currentLang === "am" ? "አዘምን" : "Update")
                    : (currentLang === "am" ? "ፍጠር" : "Create")}
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}