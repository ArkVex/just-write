import { createMiddlewareClient } from '../just-write/project/';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Create a response to modify its cookies
  const res = NextResponse.next();
  
  // Create the Supabase client with both req and res
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session and get the updated response
  const { data: { session } } = await supabase.auth.getSession();

  // Create final response with updated cookies
  const finalResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Copy over the session cookies to the final response
  const responseCookies = res.headers.getSetCookie();
  responseCookies.forEach(cookie => {
    finalResponse.headers.append('Set-Cookie', cookie);
  });

  // Handle protected routes
  const path = req.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/profile'];
  
  if (protectedRoutes.includes(path) && !session) {
    const redirectUrl = new URL('/login', req.url);
    // Ensure cookies are also set on the redirect response
    const redirectResponse = NextResponse.redirect(redirectUrl);
    responseCookies.forEach(cookie => {
      redirectResponse.headers.append('Set-Cookie', cookie);
    });
    return redirectResponse;
  }

  return finalResponse;
}

// Update matcher to be more specific
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
