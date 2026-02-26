'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ locale }) {
  const pathname = usePathname();
  const otherLocale = locale === 'he' ? 'en' : 'he';
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <Link
      href={otherPath}
      className="text-white/70 hover:text-white transition-colors text-[13px] font-300 inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
      lang={otherLocale}
    >
      {locale === 'he' ? 'EN' : 'עב'}
    </Link>
  );
}
