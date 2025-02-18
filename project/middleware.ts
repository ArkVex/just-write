// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/api/protected'
];

// Define auth routes where logged-in users shouldn't access
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password'
];

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh the session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const requestUrl = new URL(req.url);
    const currentPath = requestUrl.pathname;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => 
      currentPath === route
    );

    // Redirect unauthenticated users trying to access protected routes
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users trying to access auth routes
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (e) {
    console.error('Auth middleware error:', e);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Matcher configuration
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/protected/:path*',
    
    // Auth routes
    '/login',
    '/signup',
    '/forgot-password',
    
    // Exclude static files and images
    '/((?!_next/static|_next/image|favicon.ico|public/.*|assets/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
};