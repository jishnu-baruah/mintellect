import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/workflow/archives`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Workflow archives error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get archived workflows' },
      { status: 500 }
    );
  }
} 