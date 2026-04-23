"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TeacherDashboardLayout } from "@/components/dashboard/teacher/layout/TeacherLayout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

export default function TeacherResponsesPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Get current teacher info
        const teacherRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (teacherRes.ok) {
          const teacherData = await teacherRes.json();
          setTeacherId(teacherData.id);
        }

        const [responsesRes, templatesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/responses`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE_URL}/api/templates`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (responsesRes.ok) {
          const responsesData = await responsesRes.json();
          setResponses(responsesData);
        }

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter responses by teacherId
  const teacherResponses = teacherId ? responses.filter((r: any) => r.teacherId === teacherId) : [];

  // Group responses by template
  const responsesByTemplate = teacherResponses.reduce((acc: any, response: any) => {
    const templateId = response.templateId;
    if (!acc[templateId]) {
      acc[templateId] = [];
    }
    acc[templateId].push(response);
    return acc;
  }, {});

  if (loading) {
    return (
      <TeacherDashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </TeacherDashboardLayout>
    );
  }

  return (
    <TeacherDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Student Responses</h1>
          <p className="text-muted-foreground">View and manage student submissions assigned to you</p>
        </div>

        {Object.keys(responsesByTemplate).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No student responses yet</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(responsesByTemplate).map(([templateId, templateResponses]: [string, any]) => {
            const template = templates.find((t: any) => t.id === Number(templateId));
            return (
              <Card key={templateId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <span>{template?.title || template?.name || `Template ${templateId}`}</span>
                    </div>
                    <Badge variant="secondary">{templateResponses.length} Responses</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {templateResponses.map((response: any) => (
                      <div key={response.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Student ID: {response.studentId}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(response.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </TeacherDashboardLayout>
  );
}
