import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Ensure we're getting JSON data
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        {
          status: 415,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { text } = await request.json();
    console.log('Processing text:', text);

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text field is required and must be a string' },
        { status: 400 }
      );
    }

    const result = text.toUpperCase();
    
    return NextResponse.json({ 
      success: true,
      result 
    });
  } catch (error) {
    console.error('Log route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request' 
      }, 
      { status: 500 }
    );
  }
}
