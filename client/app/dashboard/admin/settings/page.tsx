"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/dashboard/admin/layouts/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Shield, Palette, Check, Key, Lock, User, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Privacy settings
  const [dataPrivacy, setDataPrivacy] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const handleSave = () => {
    toast({
      title: "✅ Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled for your account.",
    });
  };

  const handleChangePassword = () => {
    if (password.length < 8) {
      toast({
        title: "❌ Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "✅ Password Changed",
      description: "Your password has been updated successfully.",
    });
    setPassword("");
    setShowPasswordChange(false);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 h-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account and security settings
            </p>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Security */}
          <Card className="border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Security</CardTitle>
                  <CardDescription className="text-xs">
                    Protect your account with security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button
                  onClick={handleToggle2FA}
                  variant={twoFactorEnabled ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    twoFactorEnabled && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {twoFactorEnabled && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>

              {/* Password Change */}
              <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="gap-2 h-8 cursor-pointer"
                >
                  <Key className="h-4 w-4" />
                  {showPasswordChange ? "Cancel" : "Change Password"}
                </Button>

                {showPasswordChange && (
                  <div className="space-y-3 pt-3">
                    <div className="space-y-1">
                      <Label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="h-9 text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-sm cursor-pointer"
                    >
                      Update Password
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription className="text-xs">
                    Manage how you receive notifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive updates via email
                  </p>
                </div>
                <Button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  variant={emailNotifications ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    emailNotifications && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      emailNotifications ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {emailNotifications && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive in-app notifications
                  </p>
                </div>
                <Button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  variant={pushNotifications ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    pushNotifications && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      pushNotifications ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {pushNotifications && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive alerts via text message
                  </p>
                </div>
                <Button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  variant={smsNotifications ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    smsNotifications && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      smsNotifications ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {smsNotifications && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Privacy</CardTitle>
                  <CardDescription className="text-xs">
                    Control your privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Data Collection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Data Collection
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Allow anonymous data collection for improvement
                  </p>
                </div>
                <Button
                  onClick={() => setDataPrivacy(!dataPrivacy)}
                  variant={dataPrivacy ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    dataPrivacy && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      dataPrivacy ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {dataPrivacy && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>

              {/* Profile Visibility */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Profile Visibility
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Make your profile visible to other users
                  </p>
                </div>
                <Button
                  onClick={() => setProfileVisibility(!profileVisibility)}
                  variant={profileVisibility ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-14 rounded-full p-1 cursor-pointer",
                    profileVisibility && "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center",
                      profileVisibility ? "translate-x-6" : "translate-x-0"
                    )}
                  >
                    {profileVisibility && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Account</CardTitle>
                  <CardDescription className="text-xs">
                    Manage your account information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    defaultValue="admin"
                    disabled
                    className="h-9 text-sm bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    defaultValue="admin@university.edu"
                    disabled
                    className="h-9 text-sm bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-8 cursor-pointer"
                >
                  <Smartphone className="h-4 w-4" />
                  Manage Connected Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
