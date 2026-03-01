import { NextResponse } from 'next/server';

// Dummy in-memory store for demonstration
let templates: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Add basic validation if needed
    const newTemplate = { ...data, id: Date.now() };
    templates.push(newTemplate);
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(templates);
}
