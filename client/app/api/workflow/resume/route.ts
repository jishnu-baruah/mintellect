import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Archive URL is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`http://localhost:5000/api/workflow/resume?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Workflow resume error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resume workflow' },
      { status: 500 }
    );
  }
} 