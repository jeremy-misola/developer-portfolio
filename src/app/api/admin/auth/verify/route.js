import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/admin';

export async function GET(request) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('admin_session')?.value;
    
    if (!sessionToken || !isValidSession(sessionToken)) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Session is valid' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    );
  }
}