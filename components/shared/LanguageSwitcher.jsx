'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ locale, dict }) {
  const pathname = usePathname();
  const otherLocale = locale === 'he' ? 'en' : 'he';

  let otherPath;
  if (locale === 'he') {
    // Hebrew uses bare paths — prepend /en
    otherPath = `/en${pathname === '/' ? '' : pathname}`;
  } else {
    // English uses /en/... — strip prefix for Hebrew bare path
    otherPath = pathname.replace(/^\/en/, '') || '/';
  }

  return (
    <Link
      href={otherPath}
      className="text-white/70 hover:text-white transition-colors text-[13px] font-300 inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
      lang={otherLocale}
      aria-label={dict?.ariaLang}
    >
      {locale === 'he' ? 'EN' : 'עב'}
    </Link>
  );
}
