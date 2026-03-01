"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, HelpCircle } from 'lucide-react';

export default function QuestionBank() {
  return (
    <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-600" />
          Question Bank
        </CardTitle>
        <Button className="bg-gradient-to-r from-amber-500 to-rose-500 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Question bank is being set up. Please check back soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}