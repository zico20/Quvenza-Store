import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authStorage = request.cookies.get('admin-auth-storage')?.value;
    let isAuthenticated = false;

    if (authStorage) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authStorage));
        const state = parsed?.state;
        isAuthenticated =
          !!state?.accessToken && state?.user?.role === 'ADMIN';
      } catch {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
