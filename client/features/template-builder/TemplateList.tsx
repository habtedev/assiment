"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TemplateList() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      try {
        const res = await fetch('/api/templates', { credentials: 'include' });
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          Assessment Templates
        </CardTitle>
        <Button 
          onClick={() => router.push('/dashboard/admin/templates/new')}
          className="bg-gradient-to-r from-amber-500 to-rose-500 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No templates yet. Create your first template to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => {
              const title = typeof template.title === 'object' ? template.title[currentLang] || template.title['en'] : template.title;
              const description = typeof template.description === 'object' ? template.description[currentLang] || template.description['en'] : template.description;
              return (
                <Card key={template.id} className="border bg-white dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{description}</p>
                    {/* Show both languages for preview */}
                    {typeof template.title === 'object' && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-semibold">Amharic:</span> {template.title['am'] || '—'}<br />
                        <span className="font-semibold">English:</span> {template.title['en'] || '—'}
                      </div>
                    )}
                    {typeof template.description === 'object' && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-semibold">Amharic:</span> {template.description['am'] || '—'}<br />
                        <span className="font-semibold">English:</span> {template.description['en'] || '—'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
