import { NextResponse } from 'next/server';

const locales = ['he', 'en'];
const defaultLocale = 'he';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If URL has the default locale prefix, redirect to bare path
  if (pathnameLocale === defaultLocale) {
    const bare = pathname.slice(`/${defaultLocale}`.length) || '/';
    request.nextUrl.pathname = bare;
    return NextResponse.redirect(request.nextUrl);
  }

  // If URL has a non-default locale prefix, pass through
  if (pathnameLocale) return;

  // No locale prefix — rewrite internally to default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.svg|logo\\.svg|robots\\.txt|sitemap\\.xml).*)'],
};
