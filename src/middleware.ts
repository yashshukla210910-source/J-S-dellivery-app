import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from './lib/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  let session = null;
  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  // Handle protected routes
  if (path.startsWith('/user') && (!session || session.role !== 'USER')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (path.startsWith('/shopkeeper') && (!session || session.role !== 'SHOPKEEPER')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (path.startsWith('/delivery') && (!session || session.role !== 'DELIVERY')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (path.startsWith('/admin') && (!session || session.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Session remains valid for 24h from login (set in auth.ts).
  // We do not update the cookie here to prevent Next.js RSC Set-Cookie dropouts.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/shopkeeper/:path*', '/delivery/:path*', '/admin/:path*'],
};
