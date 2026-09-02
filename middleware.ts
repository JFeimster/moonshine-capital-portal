import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from './lib/permissions';
import {
  SESSION_COOKIE_NAME,
  verifySession,
} from './lib/session-token';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const secret = process.env.AUTH_SESSION_SECRET;
  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD;

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = '/access';
  accessUrl.search = '';
  accessUrl.searchParams.set('returnTo', pathname);

  if (!secret || !adminPassword) {
    return NextResponse.redirect(accessUrl);
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(accessUrl);
  }

  const session = await verifySession(token, secret);
  if (!session || !hasAccess(session.role, pathname)) {
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
