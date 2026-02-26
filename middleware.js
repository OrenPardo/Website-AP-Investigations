import { NextResponse } from 'next/server';

const locales = ['he', 'en'];
const defaultLocale = 'he';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.svg|logo\\.svg|robots\\.txt|sitemap\\.xml).*)'],
};
