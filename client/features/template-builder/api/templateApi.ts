// Template API: Save and fetch templates from backend (no local storage)

export async function saveTemplate(template: any) {
  const response = await fetch('/api/template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header if needed
    },
    body: JSON.stringify(template),
  });
  if (!response.ok) {
    throw new Error('Failed to save template');
  }
  return await response.json();
}

export async function fetchTemplates() {
  const response = await fetch('/api/template', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header if needed
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return await response.json();
}
