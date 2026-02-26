import { locales, defaultLocale } from '@/i18n/config';

const BASE_URL = 'https://alonpardo.co.il';

const routes = ['', '/services', '/about', '/contact'];

function localeUrl(locale, route) {
  if (locale === defaultLocale) {
    return `${BASE_URL}${route || '/'}`;
  }
  return `${BASE_URL}/${locale}${route}`;
}

export default function sitemap() {
  const entries = [];

  for (const route of routes) {
    const languages = {};
    for (const locale of locales) {
      languages[locale] = localeUrl(locale, route);
    }

    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, route),
        lastModified: new Date('2026-02-26'),
        alternates: { languages },
      });
    }
  }

  return entries;
}
