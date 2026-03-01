const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8500';

export interface TemplateApiData {
  name: Record<string, string>;
  intro: Record<string, string>;
  why: Record<string, string>;
  calendarType: string;
  academicYear: string;
  semester: string;
  questions: any[];
}

export const templateApi = {
  createTemplate: async (data: TemplateApiData) => {
    const response = await fetch(`${API_BASE_URL}/api/template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create template');
    }
    return response.json();
  },

  updateTemplate: async (id: string, data: TemplateApiData) => {
    const response = await fetch(`${API_BASE_URL}/api/template/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update template');
    }
    return response.json();
  },

  getTemplate: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/template/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }
    return response.json();
  },

  getTemplates: async () => {
    const response = await fetch(`${API_BASE_URL}/api/template`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    return response.json();
  },

  deleteTemplate: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/template/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
    return response.json();
  },
};
