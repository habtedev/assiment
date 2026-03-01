// Example usage of TemplateEditForm
import React from 'react';
import TemplateEditForm from './TemplateEditForm';

export default function EditTemplatePage() {
  // Fetch template data here (mock for now)
  const templateData = {
    title: 'Sample Template',
    description: 'Edit this template',
    questions: ['What is your name?', 'How do you rate the course?'],
  };

  const handleEditSubmit = async (values) => {
    // Call API to update template
    // await fetch(...)
    console.log('Updated values:', values);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Template</h2>
      <TemplateEditForm initialData={templateData} onSubmit={handleEditSubmit} />
    </div>
  );
}
