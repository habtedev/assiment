import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const templateEditSchema = z.object({
  title: z.string().min(1, 'Title required'),
  name: z.string().min(1, 'Template name required'),
  calendar: z.string().min(1, 'Calendar required'),
  description: z.string().optional(),
  questions: z.array(z.string()).min(1, 'At least one question required'),
});

export default function TemplateEditForm({ initialData, onSubmit }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(templateEditSchema),
    defaultValues: initialData || { title: '', name: '', calendar: '', description: '', questions: [''] },
  });

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      toast({ title: 'Template updated', description: 'Changes saved successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update template.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Input {...form.register('title')} placeholder="Title" />
      <Input {...form.register('name')} placeholder="Template Name" />
      <Input {...form.register('calendar')} placeholder="Calendar" />
      <Input {...form.register('description')} placeholder="Description" />
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Question</th>
          </tr>
        </thead>
        <tbody>
          {form.watch('questions').map((q, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">
                <Input
                  {...form.register(`questions.${idx}`)}
                  placeholder={`Question ${idx + 1}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button type="submit">Update Template</Button>
    </form>
  );
}
