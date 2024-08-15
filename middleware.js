// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = new URL(request.url);
  const isAuthenticated = request.cookies.get('loggedin') === 'true';

  // Redirect authenticated users from the login page to the main page
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  // Redirect unauthenticated users from protected pages to the login page
  if (!isAuthenticated && pathname.startsWith('/main')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to the requested page
  return NextResponse.next();
}

// Define the paths where middleware should be applied
export const config = {
  matcher: ['/main/:path*', '/'], // Apply middleware to all pages under /main and the home page
};
