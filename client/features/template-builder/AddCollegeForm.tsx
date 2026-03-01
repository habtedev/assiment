"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Mail, Lock, User, PlusCircle } from 'lucide-react';

export default function AddCollegeForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "College Added Successfully",
        description: `${form.collegeName} has been registered.`,
      });
      setForm({ name: "", email: "", password: "", collegeName: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white">
            <Building2 className="h-4 w-4" />
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
            className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600"
          >
            {loading ? (
              <>Adding...</>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create College
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}