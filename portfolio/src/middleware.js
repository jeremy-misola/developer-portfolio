import { NextResponse } from 'next/server';

// Authentication middleware for admin routes
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to auth endpoints and login page without authentication
  if (pathname.startsWith('/api/admin/auth') || 
      pathname === '/admin/login' || 
      pathname === '/api/cluster-state') {
    return NextResponse.next();
  }

  // Check for admin session cookie on other admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken) {
      // Redirect to login page for admin pages
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Return 401 for API endpoints
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};